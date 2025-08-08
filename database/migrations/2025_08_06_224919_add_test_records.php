<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('weapons')->insert([
            [
                'name' => 'Katana',
                'type' => 'blade',
                'power' => 100,
                'rate_of_fire' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'H&K MP5',
                'type' => 'smg',
                'rate_of_fire' => 100,
                'power' => 560,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Desert Eagle',
                'type' => 'handgun',
                'rate_of_fire' => 30,
                'power' => 400,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Remington 870',
                'type' => 'shotgun',
                'rate_of_fire' => 20,
                'power' => 700,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Combat Knife',
                'type' => 'blade',
                'rate_of_fire' => 0,
                'power' => 80,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PPSH41',
                'type' => 'smg',
                'rate_of_fire' => 90,
                'power' => 1200,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        $attachments = [
            ['name' => 'Red Dot Sight', 'area' => 'scope'],
            ['name' => 'Suppressor', 'area' => 'barrel'],
            ['name' => 'Extended Magazine', 'area' => 'magazine'],
            ['name' => 'Laser Sight', 'area' => 'underbarrel'],
            ['name' => 'Foregrip', 'area' => 'underbarrel'],
            ['name' => 'Collapsible Stock', 'area' => 'stock'],
            ['name' => 'Fixed Stock', 'area' => 'stock'],
        ];

        foreach ($attachments as $attachment) {
            DB::table('attachments')->insert([
                'name' => $attachment['name'],
                'area' => $attachment['area'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('weapons_attachments')->insert([
            [
                'weapon_id' => 1, // Katana
                'attachment_id' => 2, // Suppressor
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 1, // Red Dot Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 3, // Extended Magazine
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 6, // Extended Magazine
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6,
                'attachment_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6,
                'attachment_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6,
                'attachment_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6,
                'attachment_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
