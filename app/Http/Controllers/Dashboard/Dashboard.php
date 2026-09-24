<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ConsumerComplaint;
use App\Models\MerchantComplaint;
use App\Models\State;
use App\Models\Wilaya;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;


class Dashboard extends Controller
{
    // ─── Public pages ─────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $filters = array_filter($request->only(['date_from', 'date_to', 'state_id', 'wilaya_id']));

        $cQuery = ConsumerComplaint::query();
        $mQuery = MerchantComplaint::query();

        if (!empty($filters['date_from'])) {
            $cQuery->whereDate('created_at', '>=', $filters['date_from']);
            $mQuery->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $cQuery->whereDate('created_at', '<=', $filters['date_to']);
            $mQuery->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['state_id'])) {
            $cQuery->where('state_id', $filters['state_id']);
            $mQuery->where('state_id', $filters['state_id']);
        }
        if (!empty($filters['wilaya_id'])) {
            $cQuery->where('wilaya_id', $filters['wilaya_id']);
            $mQuery->whereHas('merchant', fn($q) => $q->where('wilaya_id', $filters['wilaya_id']));
        }

        $consumerTotal = (clone $cQuery)->count();
        $merchantTotal = (clone $mQuery)->count();

        $states = State::all();

        $consumerByState = (clone $cQuery)
            ->selectRaw('state_id, COUNT(*) as count')
            ->groupBy('state_id')
            ->pluck('count', 'state_id');

        $merchantByState = (clone $mQuery)
            ->selectRaw('state_id, COUNT(*) as count')
            ->groupBy('state_id')
            ->pluck('count', 'state_id');

        $stateStats = $states->map(fn($s) => [
            'id'       => $s->id,
            'name'     => $s->name,
            'consumer' => $consumerByState[$s->id] ?? 0,
            'merchant' => $merchantByState[$s->id] ?? 0,
            'total'    => ($consumerByState[$s->id] ?? 0) + ($merchantByState[$s->id] ?? 0),
        ]);

        $unassignedC = (clone $cQuery)->whereNull('state_id')->count();
        $unassignedM = (clone $mQuery)->whereNull('state_id')->count();
        if ($unassignedC + $unassignedM > 0) {
            $stateStats->push([
                'id'       => null,
                'name'     => 'Unassigned',
                'consumer' => $unassignedC,
                'merchant' => $unassignedM,
                'total'    => $unassignedC + $unassignedM,
            ]);
        }

        $wilayaStats = (clone $cQuery)
            ->join('wilayas', 'consumer_complaints.wilaya_id', '=', 'wilayas.id')
            ->selectRaw('wilayas.id, wilayas.name, COUNT(*) as count')
            ->groupBy('wilayas.id', 'wilayas.name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return inertia('dashboard/dashboard', [
            'stats' => [
                'total'    => $consumerTotal + $merchantTotal,
                'consumer' => $consumerTotal,
                'merchant' => $merchantTotal,
            ],
            'stateStats'    => $stateStats->values(),
            'wilayaStats'   => $wilayaStats,
            'filters'       => (object) $filters,
            'filterOptions' => [
                'states'  => $states,
                'wilayas' => Wilaya::orderBy('name')->get(),
            ],
        ]);
    }

    public function consumer(Request $request)
    {
        $filters = array_filter($request->only(['date_from', 'date_to', 'state_id', 'wilaya_id']));

        $query = ConsumerComplaint::with(['product', 'complaintType', 'wilaya', 'commune', 'state']);
        $this->applyConsumerFilters($query, $filters);

        $complaints = $query->orderBy('created_at', 'DESC')->paginate(15)->withQueryString();

        return inertia('dashboard/consumer', [
            'complaints'    => $complaints,
            'states'        => State::all(),
            'filters'       => (object) $filters,
            'filterOptions' => [
                'states'  => State::all(),
                'wilayas' => Wilaya::orderBy('name')->get(),
            ],
            'charts' => $this->consumerCharts($filters),
        ]);
    }

    public function merchant(Request $request)
    {
        $filters = array_filter($request->only(['date_from', 'date_to', 'state_id', 'wilaya_id']));

        $query = MerchantComplaint::with(['product', 'complaintType', 'merchant', 'state', 'images']);
        $this->applyMerchantFilters($query, $filters);

        $complaints = $query->orderBy('created_at', 'DESC')->paginate(15)->withQueryString();

        return inertia('dashboard/merchant', [
            'complaints'    => $complaints,
            'states'        => State::all(),
            'filters'       => (object) $filters,
            'filterOptions' => [
                'states'  => State::all(),
                'wilayas' => Wilaya::orderBy('name')->get(),
            ],
            'charts' => $this->merchantCharts($filters),
        ]);
    }

    public function updateConsumerState(Request $request, $id)
    {
        $request->validate(['state_id' => 'required|exists:states,id']);
        ConsumerComplaint::findOrFail($id)->update(['state_id' => $request->state_id]);
        return back();
    }

    public function updateMerchantState(Request $request, $id)
    {
        $request->validate(['state_id' => 'required|exists:states,id']);
        MerchantComplaint::findOrFail($id)->update(['state_id' => $request->state_id]);
        return back();
    }

    public function markConsumerSeen($id)
    {
        ConsumerComplaint::findOrFail($id)->update(['seen' => true]);
        return back();
    }

    public function markMerchantSeen($id)
    {
        MerchantComplaint::findOrFail($id)->update(['seen' => true]);
        return back();
    }

    // ─── Filter helpers ───────────────────────────────────────────────────────

    private function applyConsumerFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['date_from'])) $query->whereDate('created_at', '>=', $filters['date_from']);
        if (!empty($filters['date_to']))   $query->whereDate('created_at', '<=', $filters['date_to']);
        if (!empty($filters['state_id']))  $query->where('state_id', $filters['state_id']);
        if (!empty($filters['wilaya_id'])) $query->where('wilaya_id', $filters['wilaya_id']);
    }

    private function applyMerchantFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['date_from'])) $query->whereDate('created_at', '>=', $filters['date_from']);
        if (!empty($filters['date_to']))   $query->whereDate('created_at', '<=', $filters['date_to']);
        if (!empty($filters['state_id']))  $query->where('state_id', $filters['state_id']);
        if (!empty($filters['wilaya_id'])) $query->whereHas('merchant', fn($q) => $q->where('wilaya_id', $filters['wilaya_id']));
    }

    // ─── Chart data ───────────────────────────────────────────────────────────

    private function consumerCharts(array $filters): array
    {
        // Build a table-qualified base query to avoid column ambiguity in joins
        $b = ConsumerComplaint::query();
        if (!empty($filters['date_from'])) $b->whereDate('consumer_complaints.created_at', '>=', $filters['date_from']);
        if (!empty($filters['date_to']))   $b->whereDate('consumer_complaints.created_at', '<=', $filters['date_to']);
        if (!empty($filters['state_id']))  $b->where('consumer_complaints.state_id', $filters['state_id']);
        if (!empty($filters['wilaya_id'])) $b->where('consumer_complaints.wilaya_id', $filters['wilaya_id']);

        $monthly = (clone $b)
            ->selectRaw("DATE_FORMAT(consumer_complaints.created_at, '%Y-%m') as name, COUNT(*) as value")
            ->groupByRaw("DATE_FORMAT(consumer_complaints.created_at, '%Y-%m')")
            ->orderBy('name')
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $byRegion = (clone $b)
            ->join('wilayas', 'consumer_complaints.wilaya_id', '=', 'wilayas.id')
            ->selectRaw('wilayas.name as name, COUNT(*) as value')
            ->groupBy('wilayas.id', 'wilayas.name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $byBatch = (clone $b)
            ->whereNotNull('consumer_complaints.batch_number')
            ->selectRaw('consumer_complaints.batch_number as name, COUNT(*) as value')
            ->groupBy('consumer_complaints.batch_number')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $byBrand = (clone $b)
            ->join('products', 'consumer_complaints.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->selectRaw('brands.name as name, COUNT(*) as value')
            ->groupBy('brands.id', 'brands.name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $avgRatingProduct = (clone $b)
            ->join('products', 'consumer_complaints.product_id', '=', 'products.id')
            ->whereNotNull('consumer_complaints.rating')
            ->selectRaw('products.name as name, ROUND(AVG(consumer_complaints.rating), 2) as value')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (float) $r->value])
            ->values();

        $avgRatingBrand = (clone $b)
            ->join('products', 'consumer_complaints.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->whereNotNull('consumer_complaints.rating')
            ->selectRaw('brands.name as name, ROUND(AVG(consumer_complaints.rating), 2) as value')
            ->groupBy('brands.id', 'brands.name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (float) $r->value])
            ->values();

        return compact('monthly', 'byRegion', 'byBatch', 'byBrand', 'avgRatingProduct', 'avgRatingBrand');
    }

    private function merchantCharts(array $filters): array
    {
        // Table-qualified base query — merchants join adds another created_at, so qualify upfront
        $b = MerchantComplaint::query();
        if (!empty($filters['date_from'])) $b->whereDate('merchant_complaints.created_at', '>=', $filters['date_from']);
        if (!empty($filters['date_to']))   $b->whereDate('merchant_complaints.created_at', '<=', $filters['date_to']);
        if (!empty($filters['state_id']))  $b->where('merchant_complaints.state_id', $filters['state_id']);
        if (!empty($filters['wilaya_id'])) $b->whereHas('merchant', fn($q) => $q->where('wilaya_id', $filters['wilaya_id']));

        $monthly = (clone $b)
            ->selectRaw("DATE_FORMAT(merchant_complaints.created_at, '%Y-%m') as name, COUNT(*) as value")
            ->groupByRaw("DATE_FORMAT(merchant_complaints.created_at, '%Y-%m')")
            ->orderBy('name')
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $byRegion = (clone $b)
            ->join('merchants', 'merchant_complaints.merchant_id', '=', 'merchants.id')
            ->join('wilayas', 'merchants.wilaya_id', '=', 'wilayas.id')
            ->selectRaw('wilayas.name as name, COUNT(*) as value')
            ->groupBy('wilayas.id', 'wilayas.name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $byBatch = (clone $b)
            ->whereNotNull('merchant_complaints.batch_number')
            ->selectRaw('merchant_complaints.batch_number as name, COUNT(*) as value')
            ->groupBy('merchant_complaints.batch_number')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        $byBrand = (clone $b)
            ->join('products', 'merchant_complaints.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->selectRaw('brands.name as name, COUNT(*) as value')
            ->groupBy('brands.id', 'brands.name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value])
            ->values();

        return compact('monthly', 'byRegion', 'byBatch', 'byBrand');
    }
}
