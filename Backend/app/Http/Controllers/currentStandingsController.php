<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class currentStandingsController extends Controller
{
    public function storeCurrentStandings()
    {
        $currentStandingsCompetitors = competitorsController::getDataFrom('http://ergast.com/api/f1/current/driverstandings.json')->MRData->StandingsTable->StandingsLists[0]->DriverStandings;
        $currentStandingsConstructors = competitorsController::getDataFrom('http://ergast.com/api/f1/current/constructorstandings.json')->MRData->StandingsTable->StandingsLists[0]->ConstructorStandings;
        // Teamek pontjai és pozíciói eltárolása az adatbázisban, ahol egyezik a teamUrl
        foreach ($currentStandingsConstructors as $key => $value) {
            DB::table('teams')
            ->where('teamUrl', $value->Constructor->constructorId)
            ->update(['points' => $value->points, 'position' => $value->position]);
        }
        // Versenyzők pontjai és pozíciói eltárolása az adatbázisban, ahol egyezik a driverUrl
        foreach ($currentStandingsCompetitors as $key => $value) {
            DB::table('competitors')
            ->where('driverUrl', $value->Driver->driverId)
            ->update(['points' => $value->points, 'position' => $value->position]);
        }
    }
}
