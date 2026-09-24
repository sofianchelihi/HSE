<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Guarded;

#[Table(timestamps: true)]
#[Guarded(['id'])]
class MerchantComplaint extends Model
{
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function complaintType()
    {
        return $this->belongsTo(ComplaintType::class);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function images()
    {
        return $this->hasMany(MerchantComplaintImage::class);
    }
}
