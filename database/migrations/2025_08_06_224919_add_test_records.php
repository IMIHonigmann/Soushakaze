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
        DB::table('weapons')->insert(
            [
                [
                    'name' => 'Katana',
                    'type' => 'blade',
                    'power' => 5,
                    'accuracy' => 57,
                    'mobility' => 9,
                    'handling' => 54,
                    'rate_of_fire' => 0,
                    'extra_mags' => 0, // blades have no magazines
                    'magsize' => 0,
                    'price' => 149.99,
                    'stock_quantity' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'H&K MP5',
                    'type' => 'smg',
                    'rate_of_fire' => 60,
                    'power' => 1.1,
                    'accuracy' => 44,
                    'mobility' => 54,
                    'handling' => 50,
                    'extra_mags' => 3,
                    'magsize' => 30,
                    'price' => 1199,
                    'stock_quantity' => 15,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Desert Eagle',
                    'type' => 'handgun',
                    'rate_of_fire' => 18,
                    'power' => 3,
                    'accuracy' => 41,
                    'mobility' => 25,
                    'handling' => 40,
                    'extra_mags' => 2,
                    'magsize' => 7,
                    'price' => 899.99,
                    'stock_quantity' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Remington 870',
                    'type' => 'shotgun',
                    'rate_of_fire' => 12,
                    'power' => 3.5,
                    'accuracy' => 32,
                    'mobility' => 19,
                    'handling' => 37,
                    'extra_mags' => 1,
                    'magsize' => 6,
                    'price' => 799.99,
                    'stock_quantity' => 12,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Combat Knife',
                    'type' => 'blade',
                    'rate_of_fire' => 0,
                    'power' => 5,
                    'accuracy' => 60,
                    'mobility' => 60,
                    'handling' => 60,
                    'extra_mags' => 0,
                    'magsize' => 0,
                    'price' => 59.99,
                    'stock_quantity' => 25,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'PPSH41',
                    'type' => 'smg',
                    'rate_of_fire' => 54,
                    'power' => 1.4,
                    'accuracy' => 38,
                    'mobility' => 50,
                    'handling' => 47,
                    'extra_mags' => 4,
                    'magsize' => 35,
                    'price' => 1099,
                    'stock_quantity' => 18,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]
        );

        $attachments = [
            [
                'name' => 'Red Dot Sight',
                'area' => 'scope',
                'price_modifier' => 199.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 10,
                'mobility_modifier' => 0,
                'handling_modifier' => 5,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Suppressor',
                'area' => 'barrel',
                'price_modifier' => 299.99,
                'power_modifier' => -5,
                'accuracy_modifier' => 0,
                'mobility_modifier' => -2,
                'handling_modifier' => -1,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Extended Magazine',
                'area' => 'magazine',
                'price_modifier' => 99.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 0,
                'mobility_modifier' => -3,
                'handling_modifier' => 10,
                'magsize_modifier' => 10, // logical increase
            ],
            [
                'name' => 'Laser Sight',
                'area' => 'underbarrel',
                'price_modifier' => 119.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 8,
                'mobility_modifier' => 0,
                'handling_modifier' => 3,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Foregrip',
                'area' => 'underbarrel',
                'price_modifier' => 79.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 6,
                'mobility_modifier' => -1,
                'handling_modifier' => 7,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Collapsible Stock',
                'area' => 'stock',
                'price_modifier' => 149.99,
                'power_modifier' => 11,
                'accuracy_modifier' => 4,
                'mobility_modifier' => 5,
                'handling_modifier' => 6,
                'magsize_modifier' => 1,
            ],
            [
                'name' => 'Fixed Stock',
                'area' => 'stock',
                'price_modifier' => 129.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 6,
                'mobility_modifier' => -2,
                'handling_modifier' => 4,
                'magsize_modifier' => 0,
            ],
            [
                'name' => '4x Scope',
                'area' => 'scope',
                'price_modifier' => 349.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 20,
                'mobility_modifier' => -10,
                'handling_modifier' => -5,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Holographic Sight',
                'area' => 'scope',
                'price_modifier' => 249.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 12,
                'mobility_modifier' => -2,
                'handling_modifier' => 4,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Bipod',
                'area' => 'underbarrel',
                'price_modifier' => 89.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 15,
                'mobility_modifier' => -20,
                'handling_modifier' => -10,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Muzzle Brake',
                'area' => 'barrel',
                'price_modifier' => 159.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 6,
                'mobility_modifier' => 0,
                'handling_modifier' => -2,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Flash Hider',
                'area' => 'barrel',
                'price_modifier' => 129.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 2,
                'mobility_modifier' => 0,
                'handling_modifier' => 0,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Drum Magazine',
                'area' => 'magazine',
                'price_modifier' => 199.99,
                'power_modifier' => 0,
                'accuracy_modifier' => -2,
                'mobility_modifier' => -15,
                'handling_modifier' => -5,
                'magsize_modifier' => 25, // logical increase
            ],
            [
                'name' => 'Tactical Light',
                'area' => 'underbarrel',
                'price_modifier' => 49.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 1,
                'mobility_modifier' => 0,
                'handling_modifier' => 0,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Grip Tape',
                'area' => 'underbarrel',
                'price_modifier' => 19.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 0,
                'mobility_modifier' => 0,
                'handling_modifier' => 3,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Compensator',
                'area' => 'barrel',
                'price_modifier' => 139.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 7,
                'mobility_modifier' => 0,
                'handling_modifier' => -1,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Angled Foregrip',
                'area' => 'underbarrel',
                'price_modifier' => 89.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 5,
                'mobility_modifier' => -1,
                'handling_modifier' => 6,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Vaccum Barrel',
                'area' => 'barrel',
                'price_modifier' => 359.99,
                'power_modifier' => 11,
                'accuracy_modifier' => 0,
                'mobility_modifier' => -3,
                'handling_modifier' => -6,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Short Stock',
                'area' => 'stock',
                'price_modifier' => 89.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 0,
                'mobility_modifier' => 9,
                'handling_modifier' => -5,
                'magsize_modifier' => 0,
            ],
            [
                'name' => 'Skeleton Stock',
                'area' => 'stock',
                'price_modifier' => 129.99,
                'power_modifier' => 0,
                'accuracy_modifier' => 0,
                'mobility_modifier' => 4,
                'handling_modifier' => 6,
                'magsize_modifier' => 0,
            ]

        ];

        foreach ($attachments as $attachment) {
            DB::table('attachments')->insert([
                'name' => $attachment['name'],
                'area' => $attachment['area'],
                'price_modifier' => $attachment['price_modifier'],
                'power_modifier' => $attachment['power_modifier'],
                'accuracy_modifier' => $attachment['accuracy_modifier'],
                'mobility_modifier' => $attachment['mobility_modifier'],
                'handling_modifier' => $attachment['handling_modifier'],
                'magsize_modifier' => $attachment['magsize_modifier'] ?? 0, // <-- added
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
                'attachment_id' => 4, // Laser Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 5, // Foregrip
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
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 7, // Fixed Stock
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 8, // 4x Scope
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 9, // Holographic Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 10, // Bipod
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 11, // Muzzle Brake
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 12, // Flash Hider
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 13, // Drum Magazine
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 14, // Tactical Light
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 15, // Grip Tape
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 16, // Compensator
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2, // H&K MP5
                'attachment_id' => 17, // Angled Foregrip
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Attachments for PPSH41 (weapon_id 6)
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 18, // Vaccum Barrel
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 1, // Red Dot Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 3, // Extended Magazine
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 4, // Laser Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 5, // Foregrip
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 6, // Collapsible Stock
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 7, // Fixed Stock
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 8, // 4x Scope
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 9, // Holographic Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 10, // Bipod
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 11, // Muzzle Brake
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 12, // Flash Hider
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 13, // Drum Magazine
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 14, // Tactical Light
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 15, // Grip Tape
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 16, // Compensator
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 17, // Angled Foregrip
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 19,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 6, // PPSH41
                'attachment_id' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Existing and other weapons
            [
                'weapon_id' => 3, // Desert Eagle
                'attachment_id' => 7, // Fixed Stock
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 3, // Desert Eagle
                'attachment_id' => 8, // 4x Scope
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 4, // Remington 870
                'attachment_id' => 9, // Holographic Sight
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 4, // Remington 870
                'attachment_id' => 10, // Bipod
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 5, // Combat Knife
                'attachment_id' => 11, // Muzzle Brake
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 5, // Combat Knife
                'attachment_id' => 12, // Flash Hider
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 1, // Katana
                'attachment_id' => 13, // Drum Magazine
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
