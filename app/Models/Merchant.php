<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table(timestamps: true)]
#[Fillable(['phone', 'password','name','email','market_name','merchant_type_id','wilaya_id','commune_id'])]
class Merchant extends Authenticatable
{

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}