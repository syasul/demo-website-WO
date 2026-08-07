<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type', // decoration, makeup, photo, venue, catering, entertainment
    ];

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'package_menu_item');
    }
}
