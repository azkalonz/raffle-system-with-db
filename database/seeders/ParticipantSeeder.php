<?php

namespace Database\Seeders;

use App\Models\Participant;
use App\Models\School;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path = __DIR__ . '/artifacts/participants.csv';
        $flag = true;
        $participants = [];

        if (($handle = fopen($path, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if ($flag) {
                    $flag = false;
                    continue;
                }
                $school = School::where(function ($query) use ($data) {
                    $search_key = '%' . strtolower($data[3]) . '%';
                    $query->orWhere('name', 'like', $search_key);
                })->first();

                $id = null;

                if (isset($school->id)) {
                    $id = $school->id;
                }

                $participant = [
                    "name" => e("{$data[0]}, {$data[1]} {$data[2]}"),
                    "school_id" => $id
                ];
                array_push($participants, $participant);
            }
            fclose($handle);
        }

        DB::table('participants')->insert($participants);

        // Participant::factory()->count(1000)->create();
    }
}
