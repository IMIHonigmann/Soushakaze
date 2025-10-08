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
                'price' => 149.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'H&K MP5',
                'type' => 'smg',
                'rate_of_fire' => 100,
                'power' => 560,
                'price' => 1199,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Desert Eagle',
                'type' => 'handgun',
                'rate_of_fire' => 30,
                'power' => 400,
                'price' => 899.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Remington 870',
                'type' => 'shotgun',
                'rate_of_fire' => 20,
                'power' => 700,
                'price' => 799.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Combat Knife',
                'type' => 'blade',
                'rate_of_fire' => 0,
                'power' => 80,
                'price' => 59.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PPSH41',
                'type' => 'smg',
                'rate_of_fire' => 90,
                'power' => 1200,
                'price' => 1099,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        $attachments = [
            ['name' => 'Red Dot Sight', 'area' => 'scope', 'price' => 199.99],
            ['name' => 'Suppressor', 'area' => 'barrel', 'price' => 299.99],
            ['name' => 'Extended Magazine', 'area' => 'magazine', 'price' => 99.99],
            ['name' => 'Laser Sight', 'area' => 'underbarrel', 'price' => 119.99],
            ['name' => 'Foregrip', 'area' => 'underbarrel', 'price' => 79.99],
            ['name' => 'Collapsible Stock', 'area' => 'stock', 'price' => 149.99],
            ['name' => 'Fixed Stock', 'area' => 'stock', 'price' => 129.99],
        ];

        foreach ($attachments as $attachment) {
            DB::table('attachments')->insert([
                'name' => $attachment['name'],
                'area' => $attachment['area'],
                'price' => $attachment['price'],
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
                'attachment_id' => 6, // Collapsible Stock
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
                'attachment_id' => 5,
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
