<?php


namespace App\Http\Controllers\Home;


use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ComplaintType;
use App\Enums\UserType;
use App\Models\Wilaya;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\ConsumerComplaint;


class ConsumerComplaintController extends Controller
{
    public function index()
    {

        $products = Product::all();
        $types = ComplaintType::where('type','=',UserType::CONSUMER->value)->get();
        $wilayas = Wilaya::with('communes')->get();

        return inertia('home/consumerComplaint', [
            'products' => $products,
            'types' => $types,
            'wilayas' => $wilayas
        ]);
    }


    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'consumer_name' => ['required', 'string', 'max:255'],
            'consumer_email' => ['required', 'string', 'email', 'max:255'],
            'consumer_phone' => ['required', 'string', 'max:15'],
            'market_name' => ['required', 'string', 'max:255'],
            'wilaya_id' => ['required', 'exists:wilayas,id','integer'],
            'commune_id' => ['required', 'exists:communes,id', 'integer'],
            'product_id' => ['required', 'exists:products,id', 'integer'],
            'complaint_type_id' => ['required', 'exists:complaint_types,id', 'integer'],
            'comment' => ['required', 'string', 'max:255'],
            'batch_number' => ['required', 'string', 'max:255'],
            'fabrication_date' => ['required', 'date'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'voice_note' => ['required', 'file'],
        ]);

        if($request->hasFile('voice_note')) {
            $path = $request->file('voice_note')->store('audios', 'public');
            $validatedData['audio_path'] = $path;
            unset($validatedData['voice_note']);
        }

        $complaint = ConsumerComplaint::create([...$validatedData,'state_id' => 1]);

        return redirect()->route('home.index');
    }

}