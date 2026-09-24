<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Guarded;

#[Guarded(['id'])]
class MerchantComplaintImage extends Model
{
    public $timestamps = false;

    public function complaint()
    {
        return $this->belongsTo(MerchantComplaint::class);
    }
}
