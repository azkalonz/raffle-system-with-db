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
            'email' => 'admin@psite7.com',
            'password' => bcrypt("V8YY663p"),
        ]);

        DB::table('schools')->insert([
            [
                'id' => 1,
                'name' => "University of Cebu - LM Campus",
                'picture' => "https://universityofcebu.ethinksites.com/pluginfile.php/1/core_admin/logocompact/300x300/1597412510/UC%20logofinal.png",
            ], [
                'id' => 2,
                'name' => "University of Cebu - Main Campus",
                'picture' => "https://universityofcebu.ethinksites.com/pluginfile.php/1/core_admin/logocompact/300x300/1597412510/UC%20logofinal.png",
            ], [
                'id' => 3,
                'name' => "University of Cebu - Banilad Campus",
                'picture' => "https://universityofcebu.ethinksites.com/pluginfile.php/1/core_admin/logocompact/300x300/1597412510/UC%20logofinal.png",
            ],
        ]);

        DB::table('items')->insert([
            [
                "name" => "iPhone 12"
            ], [
                "name" => "iPhone 13"
            ], [
                "name" => "iPhone 14"
            ], [
                "name" => "iPhone 15"
            ], [
                "name" => "iPhone 16"
            ], [
                "name" => "iPhone 17"
            ],
        ]);

        $this->call([
            ParticipantSeeder::class,
        ]);
    }
}
