<?php

namespace App\Enums;

enum UserType : string
{
    case CONSUMER = 'consumer';
    case MERCHANT = 'merchant';

    public function label(): string
    {
        return match ($this) {
            self::CONSUMER => 'Consommateur',
            self::MERCHANT => 'Commerçant',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}