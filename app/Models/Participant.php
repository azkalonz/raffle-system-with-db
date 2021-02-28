<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;
    protected $table = "participants";
    protected $fillable = ["name", "school_id", "student_id"];

    public function school()
    {
        return $this->hasOne(School::class, "id", "school_id");
    }

    public function wins()
    {
        return $this->hasMany(Winner::class, "participant_id", "id");
    }
}
