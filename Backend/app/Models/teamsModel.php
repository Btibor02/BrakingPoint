<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class teamsModel extends Model
{
    use HasFactory;
    protected $table = 'teams';
    protected $primaryKey = 'teamID';
    public $incrementing = 'false';
    public $timestamps = false;

    protected $fillable = [
        'teamUrl',
        'name',
        'nationality',
        'description'
    ];
}
