<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => "Admin",
            'email' => 'markjosephjudaya@gmail.com',
            'password' => bcrypt("123456"),
        ]);

        $path = __DIR__ . '/artifacts/schools.csv';
        $schools = [];

        if (($handle = fopen($path, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $school = [
                    "name" => $data[0],
                    "picture" => $data[1],
                ];
                array_push($schools, $school);
            }
            fclose($handle);
        }

        DB::table('schools')->insert($schools);

        DB::table('items')->insert([
            [
                "name" => "E-Load",
                "quantity" => 20,
                "amount" => 200
            ], [
                "name" => "Jollibee Gift Voucher",
                "quantity" => 15,
                "amount" => 180
            ], [
                "name" => "Grabfood Gift Voucher",
                "quantity" => 13,
                "amount" => 100
            ], [
                "name" => "GCash",
                "quantity" => 5,
                "amount" => 300
            ], [
                "name" => "GCash",
                "quantity" => 5,
                "amount" => 500
            ],
        ]);

        $this->call([
            ParticipantSeeder::class,
        ]);
    }
}
