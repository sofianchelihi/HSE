<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;

#[Table(timestamps: false)]
class Wilaya extends Model
{
    public function communes()
    {
        return $this->hasMany(Commune::class);
    }
}