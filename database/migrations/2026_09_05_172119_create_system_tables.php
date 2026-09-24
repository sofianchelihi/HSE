<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::dropIfExists('brands');
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });


        Schema::dropIfExists('products');
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(\App\Models\Brand::class)->nullable()->constrained()->nullOnDelete();
            $table->string('barcode')->nullable();
        });


        Schema::dropIfExists('complaint_types');
        Schema::create('complaint_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
        });


        Schema::dropIfExists('wilayas');
        Schema::create('wilayas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });


        Schema::dropIfExists('communes');
        Schema::create('communes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(\App\Models\Wilaya::class)->nullable()->constrained()->nullOnDelete();
        });


        Schema::dropIfExists('states');
        Schema::create('states', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });


        Schema::dropIfExists('consumer_complaints');
        Schema::create('consumer_complaints', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('comment')->nullable();
            $table->string('audio_path')->nullable();
            $table->foreignIdFor(\App\Models\Product::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\ComplaintType::class)->nullable()->constrained()->nullOnDelete();
            $table->string('batch_number')->nullable();
            $table->date('fabrication_date')->nullable();
            $table->foreignIdFor(\App\Models\Wilaya::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\Commune::class)->nullable()->constrained()->nullOnDelete();
            $table->string('market_name')->nullable();
            $table->integer('rating')->nullable();
            $table->string('consumer_name')->nullable();
            $table->string('consumer_phone')->nullable();
            $table->string('consumer_email')->nullable();
            $table->foreignIdFor(\App\Models\State::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\User::class)->nullable()->constrained()->nullOnDelete();
        });


        Schema::dropIfExists('merchant_types');
        Schema::create('merchant_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });


        Schema::dropIfExists('merchants');
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('market_name')->nullable();
            $table->string('password');
            $table->foreignIdFor(\App\Models\MerchantType::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\Wilaya::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\Commune::class)->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });


        Schema::dropIfExists('merchant_complaints');
        Schema::create('merchant_complaints', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('comment')->nullable();
            $table->string('audio_path')->nullable();
            $table->foreignIdFor(\App\Models\Product::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\ComplaintType::class)->nullable()->constrained()->nullOnDelete();
            $table->string('batch_number')->nullable();
            $table->date('fabrication_date')->nullable();
            $table->foreignIdFor(\App\Models\State::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\Merchant::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(\App\Models\User::class)->nullable()->constrained()->nullOnDelete();
        });




        Schema::dropIfExists('merchant_complaint_images');
        Schema::create('merchant_complaint_images', function (Blueprint $table) {
            $table->id();
            $table->string('image_path')->nullable();
            $table->foreignIdFor(\App\Models\MerchantComplaint::class)->nullable()->constrained()->nullOnDelete();
        });





    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::dropIfExists('brands');
        Schema::dropIfExists('consumer_complaints');
        Schema::dropIfExists('merchant_complaint_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('complaint_types');
        Schema::dropIfExists('wilayas');
        Schema::dropIfExists('communes');
        Schema::dropIfExists('states');
        Schema::dropIfExists('merchants');
        Schema::dropIfExists('merchant_types');

    }
};