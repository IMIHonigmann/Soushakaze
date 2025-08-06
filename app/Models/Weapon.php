<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weapon extends Model
{
    protected $fillable = ['name', 'type', 'rate_of_fire', 'power'];

    public function attachments()
    {
        return $this->belongsToMany(Attachment::class, 'weapons_attachments');
    }
}
