<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Winner extends Model
{
    use HasFactory;
    protected $table = "winners";
    protected $fillable = ["participant_id", "item_id"];

    public function participant()
    {
        return $this->hasOne(Participant::class, "id", "participant_id");
    }

    public function item()
    {
        return $this->hasOne(Item::class, "id", "item_id");
    }
}
