<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = ['name', 'area'];

    public function weapons()
    {
        return $this->belongsToMany(Weapon::class, 'weapons_attachments');
    }
}
