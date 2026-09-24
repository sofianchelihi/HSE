<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ConsumerComplaint;
use App\Models\MerchantComplaint;
use App\Models\State;
use App\Models\Wilaya;
use Illuminate\Http\Request;


class Dashboard extends Controller
{
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

        // Per-state breakdown
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

        // Top wilayas by consumer complaint volume
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

        $query = ConsumerComplaint::with([
            'product',
            'complaintType',
            'wilaya',
            'commune',
            'state',
        ]);

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }
        if (!empty($filters['wilaya_id'])) {
            $query->where('wilaya_id', $filters['wilaya_id']);
        }

        $complaints = $query->orderBy('created_at', 'DESC')->paginate(15)->withQueryString();

        return inertia('dashboard/consumer', [
            'complaints'    => $complaints,
            'states'        => State::all(),
            'filters'       => (object) $filters,
            'filterOptions' => [
                'states'  => State::all(),
                'wilayas' => Wilaya::orderBy('name')->get(),
            ],
        ]);
    }

    public function merchant(Request $request)
    {
        $filters = array_filter($request->only(['date_from', 'date_to', 'state_id', 'wilaya_id']));

        $query = MerchantComplaint::with([
            'product',
            'complaintType',
            'merchant',
            'state',
            'images',
        ]);

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }
        if (!empty($filters['wilaya_id'])) {
            $query->whereHas('merchant', fn($q) => $q->where('wilaya_id', $filters['wilaya_id']));
        }

        $complaints = $query->orderBy('created_at', 'DESC')->paginate(15)->withQueryString();

        return inertia('dashboard/merchant', [
            'complaints'    => $complaints,
            'states'        => State::all(),
            'filters'       => (object) $filters,
            'filterOptions' => [
                'states'  => State::all(),
                'wilayas' => Wilaya::orderBy('name')->get(),
            ],
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
}