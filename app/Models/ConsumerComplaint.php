<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Guarded;


#[Table(timestamps: true)]
#[Guarded(['id'])]
class ConsumerComplaint extends Model
{
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function complaintType()
    {
        return $this->belongsTo(ComplaintType::class);
    }

    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class);
    }

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }
}
