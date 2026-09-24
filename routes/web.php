<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\ConsumerComplaintController;
use App\Http\Controllers\Home\MerchantComplaintController;
use App\Http\Controllers\Home\MerchantAuthController;
use App\Http\Controllers\Dashboard\Dashboard;

Route::inertia('/', 'welcome')->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });




Route::prefix('home')->group(function () {

    Route::get('/', [HomeController::class, 'index'])
        ->name('home.index');

    Route::get('/consumer', [ConsumerComplaintController::class, 'index'])
        ->name('home.consumer');

    Route::post('/consumer', [ConsumerComplaintController::class, 'create'])
        ->name('home.consumer.create');

    Route::get('/merchant', [MerchantComplaintController::class, 'index'])
        ->middleware(['auth:merchant'])
        ->name('home.merchant');

    Route::post('/merchant', [MerchantComplaintController::class, 'create'])
        ->middleware(['auth:merchant'])
        ->name('home.merchant.create');


    Route::get('/merchant/login', [MerchantAuthController::class, 'create'])
        ->name('home.merchant.login');

    Route::get('/merchant/register', [MerchantAuthController::class, 'createRegister'])
        ->name('home.merchant.register');

    Route::post('/merchant/login', [MerchantAuthController::class, 'store'])
        ->name('home.merchant.login.store');

    Route::post('/merchant/logout', [MerchantAuthController::class, 'destroy'])
        ->name('home.merchant.logout');

    Route::post('/merchant/register', [MerchantAuthController::class, 'storeRegister'])
        ->name('home.merchant.register.store');

    Route::post('/merchant/logout', [MerchantAuthController::class, 'destroy'])
        ->name('home.merchant.logout');


});


Route::prefix('dashboard')->middleware(['auth'])->group(function () {
    Route::get('/', [Dashboard::class, 'index'])
        ->name('dashboard');

    Route::get('/consumer', [Dashboard::class, 'consumer'])
        ->name('dashboard.consumer');

    Route::get('/merchant', [Dashboard::class, 'merchant'])
        ->name('dashboard.merchant');

    Route::patch('/consumer/{id}/state', [Dashboard::class, 'updateConsumerState'])
        ->name('dashboard.consumer.state');

    Route::patch('/merchant/{id}/state', [Dashboard::class, 'updateMerchantState'])
        ->name('dashboard.merchant.state');

    Route::patch('/consumer/{id}/seen', [Dashboard::class, 'markConsumerSeen'])
        ->name('dashboard.consumer.seen');

    Route::patch('/merchant/{id}/seen', [Dashboard::class, 'markMerchantSeen'])
        ->name('dashboard.merchant.seen');
});

require __DIR__.'/settings.php';