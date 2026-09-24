<?php


namespace App\Http\Controllers\Home;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Merchant;
use App\Models\MerchantType;
use App\Models\Wilaya;


class merchantAuthController extends Controller
{


    public function create()
    {
        return inertia('home/merchantLogin');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember');

        if (!Auth::guard('merchant')->attempt(
            [
                'phone' => $credentials['phone'],
                'password' => $credentials['password'],
            ],
            $remember
        )) {
            return back()->withErrors([
                'phone' => 'The phone number or password is incorrect.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->route('home.merchant');
    }

    public function destroy(Request $request)
    {
        Auth::guard('merchant')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home.index');
    }

    public function createRegister()
    {
        $merchantTypes = MerchantType::all();
        $wilayas = Wilaya::with('communes')->get();


        return inertia('home/merchantRegister', [
            'merchantTypes' => $merchantTypes,
            'wilayas' => $wilayas,
        ]);
    }

    public function storeRegister(Request $request)
    {
        // Validate the registration data
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:merchants'],
            'phone' => ['required', 'string', 'max:15', 'unique:merchants'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'market_name' => ['required', 'string', 'max:255'],
            'merchant_type_id' => ['integer','filled','required', 'exists:merchant_types,id'],
            'wilaya_id' => ['required', 'exists:wilayas,id', 'filled','integer'],
            'commune_id' => ['required', 'exists:communes,id', 'filled','integer'],
        ]);

        // Create a new merchant
        $merchant = Merchant::create([
            'name' => $validatedData['name'],
            'phone' => $validatedData['phone'],
            'password' => $validatedData['password'],
            'email' => $validatedData['email'],
            'market_name' => $validatedData['market_name'],
            'merchant_type_id' => $validatedData['merchant_type_id'],
            'wilaya_id' => $validatedData['wilaya_id'],
            'commune_id' => $validatedData['commune_id'],
        ]);

        // Log in the newly registered merchant
        Auth::guard('merchant')->login($merchant);

        return redirect()->route('home.merchant');
    }
}