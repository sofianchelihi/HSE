<?php


namespace App\Http\Controllers\Home;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ComplaintType;
use App\Enums\UserType;
use App\Models\MerchantComplaint;
use App\Models\MerchantComplaintImage;


class merchantComplaintController extends Controller
{
    public function index()
    {
        $products = Product::all();
        $types = ComplaintType::where('type','=',UserType::MERCHANT->value)->get();

        return inertia('home/merchantComplaint', [
            'products' => $products,
            'types' => $types,
        ]);
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'product_id'        => ['required', 'exists:products,id', 'integer'],
            'complaint_type_id' => ['required', 'exists:complaint_types,id', 'integer'],
            'batch_number'      => ['required', 'string', 'max:255'],
            'fabrication_date'  => ['required', 'date'],
            'comment'           => ['required', 'string', 'max:255'],
            'voice_note'        => ['nullable', 'file'],
            'photos'            => ['nullable', 'array', 'max:3'],
            'photos.*'          => ['file', 'image', 'max:5120'],
        ]);

        $validatedData['merchant_id'] = auth('merchant')->id();

        if ($request->hasFile('voice_note')) {
            $path = $request->file('voice_note')->store('audios', 'public');
            $validatedData['audio_path'] = $path;
        }

        unset($validatedData['voice_note'], $validatedData['photos']);

        $complaint = MerchantComplaint::create([...$validatedData, 'state_id' => 1]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $imagePath = $photo->store('images', 'public');
                MerchantComplaintImage::create([
                    'merchant_complaint_id' => $complaint->id,
                    'image_path'            => $imagePath,
                ]);
            }
        }

        return redirect()->route('home.index');
    }

}