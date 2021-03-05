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
                "name" => "ELoad",
                "quantity" => 20,
                "amount" => 200
            ], [
                "name" => "Jollibee",
                "quantity" => 15,
                "amount" => 180
            ], [
                "name" => "Grabfood",
                "quantity" => 13,
                "amount" => 100
            ], [
                "name" => "Q & A (ELoad)",
                "quantity" => 5,
                "amount" => 400
            ],
        ]);

        $this->call([
            ParticipantSeeder::class,
        ]);
    }
}
