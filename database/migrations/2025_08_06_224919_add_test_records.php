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
        // Insert manufacturers
        $manufacturers = [
            ['name' => 'Heckler & Koch', 'email' => 'info@hk.com', 'phone' => '123-456-7890', 'address' => 'Heckler & Koch GmbH, Oberndorf, Germany', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Remington Arms', 'email' => 'contact@remington.com', 'phone' => '800-243-9700', 'address' => 'Madison, NC, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Magnum Research', 'email' => 'info@magnumresearch.com', 'phone' => '508-635-4273', 'address' => 'Pillager, MN, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Izhevsk Mechanical Plant', 'email' => 'info@izhmash.ru', 'phone' => '+7 3412 655-000', 'address' => 'Izhevsk, Russia', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cold Steel', 'email' => 'sales@coldsteel.com', 'phone' => '800-255-4716', 'address' => 'Irwindale, CA, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Generic Blades', 'email' => null, 'phone' => null, 'address' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Magpul Industries', 'email' => 'support@magpul.com', 'phone' => '877-462-4785', 'address' => 'Austin, TX, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Aimpoint', 'email' => 'info@aimpoint.com', 'phone' => '+46 8 581 948 00', 'address' => 'Malmö, Sweden', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trijicon', 'email' => 'info@trijicon.com', 'phone' => '800-338-0563', 'address' => 'Wixom, MI, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'SureFire', 'email' => 'support@surefire.com', 'phone' => '800-828-8809', 'address' => 'Fountain Valley, CA, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Generic Attachments', 'email' => null, 'phone' => null, 'address' => null, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('manufacturers')->insert($manufacturers);

        // Insert sellers
        $sellers = [
            ['name' => 'Brownells', 'email' => 'sales@brownells.com', 'phone' => '800-741-0015', 'address' => 'Montezuma, IA, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cabela\'s', 'email' => 'info@cabelas.com', 'phone' => '800-237-4444', 'address' => 'Sidney, NE, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bass Pro Shops', 'email' => 'help@basspro.com', 'phone' => '800-227-7776', 'address' => 'Springfield, MO, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'MidwayUSA', 'email' => 'customerservice@midwayusa.com', 'phone' => '800-243-3220', 'address' => 'Columbia, MO, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Academy Sports', 'email' => 'customerservice@academy.com', 'phone' => '888-922-2336', 'address' => 'Katy, TX, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Blade HQ', 'email' => 'support@bladehq.com', 'phone' => '888-252-3347', 'address' => 'Pleasant Grove, UT, USA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Generic Seller', 'email' => null, 'phone' => null, 'address' => null, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('sellers')->insert($sellers);




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
                    'price_modification_coefficient' => 1.00,
                    'next_sale_startdate' => null,
                    'next_sale_enddate' => null,
                    'manufacturer_id' => 6, // Generic Blades
                    'seller_id' => 6, // Blade HQ
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
                    'price_modification_coefficient' => 1.00,
                    'next_sale_startdate' => null,
                    'next_sale_enddate' => null,
                    'manufacturer_id' => 1, // Heckler & Koch
                    'seller_id' => 1, // Brownells
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
                    'price_modification_coefficient' => 1.00,
                    'next_sale_startdate' => null,
                    'next_sale_enddate' => null,
                    'manufacturer_id' => 3, // Magnum Research
                    'seller_id' => 2, // Cabela's
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
                    'magsize' => 8,
                    'price' => 699.99,
                    'stock_quantity' => 10,
                    'price_modification_coefficient' => 0.7,
                    'next_sale_startdate' => now()->addDays(1),
                    'next_sale_enddate' => now()->addDays(7),
                    'manufacturer_id' => 2, // Remington Arms
                    'seller_id' => 3, // Bass Pro Shops
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
                    'price_modification_coefficient' => 0.6,
                    'next_sale_startdate' => null,
                    'next_sale_enddate' => null,
                    'manufacturer_id' => 5, // Cold Steel
                    'seller_id' => 6, // Blade HQ
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
                    'price_modification_coefficient' => 1.00,
                    'next_sale_startdate' => null,
                    'next_sale_enddate' => null,
                    'manufacturer_id' => 4, // Izhevsk Mechanical Plant
                    'seller_id' => 1, // Brownells
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
                'manufacturer_id' => 8, // Aimpoint
                'seller_id' => 1, // Brownells
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
                'manufacturer_id' => 11, // Generic Attachments
                'seller_id' => 1,
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
                'manufacturer_id' => 7, // Magpul
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => 9, // Trijicon
                'seller_id' => 1,
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
                'manufacturer_id' => 8,
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => 10, // SureFire
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => 11,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => 7,
                'seller_id' => 1,
            ],
            [
                'name' => 'UNASSIGNED',
                'area' => 'other',
                'price_modifier' => 0.00,
                'power_modifier' => 0,
                'accuracy_modifier' => 0,
                'mobility_modifier' => 0,
                'handling_modifier' => 0,
                'magsize_modifier' => 0,
                'manufacturer_id' => 7,
                'seller_id' => 1,
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
                'manufacturer_id' => $attachment['manufacturer_id'] ?? null,
                'seller_id' => $attachment['seller_id'] ?? null,
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

        // Map for manufacturers and sellers (by index, adjust as needed)
        $weapon_manufacturer_map = [
            1 => 6, // Katana - Generic Blades
            2 => 1, // H&K MP5 - Heckler & Koch
            3 => 3, // Desert Eagle - Magnum Research
            4 => 2, // Remington 870 - Remington Arms
            5 => 5, // Combat Knife - Cold Steel
            6 => 4, // PPSH41 - Izhevsk Mechanical Plant
        ];
        $weapon_seller_map = [
            1 => 6, // Katana - Blade HQ
            2 => 1, // H&K MP5 - Brownells
            3 => 2, // Desert Eagle - Cabela's
            4 => 3, // Remington 870 - Bass Pro Shops
            5 => 6, // Combat Knife - Blade HQ
            6 => 1, // PPSH41 - Brownells
        ];

        // Update weapons with manufacturer_id and seller_id
        foreach ($weapon_manufacturer_map as $weapon_id => $manufacturer_id) {
            DB::table('weapons')->where('id', $weapon_id)->update([
                'manufacturer_id' => $manufacturer_id,
                'seller_id' => $weapon_seller_map[$weapon_id] ?? 7, // fallback to Generic Seller
            ]);
        }

        // Attachments manufacturer/seller map (all generic unless specified)
        $attachment_manufacturer_map = [
            1 => 8, // Red Dot Sight - Aimpoint
            2 => 11, // Suppressor - Generic Attachments
            3 => 7, // Extended Magazine - Magpul
            4 => 11, // Laser Sight - Generic Attachments
            5 => 7, // Foregrip - Magpul
            6 => 7, // Collapsible Stock - Magpul
            7 => 7, // Fixed Stock - Magpul
            8 => 9, // 4x Scope - Trijicon
            9 => 8, // Holographic Sight - Aimpoint
            10 => 11, // Bipod - Generic Attachments
            11 => 11, // Muzzle Brake - Generic Attachments
            12 => 11, // Flash Hider - Generic Attachments
            13 => 7, // Drum Magazine - Magpul
            14 => 10, // Tactical Light - SureFire
            15 => 11, // Grip Tape - Generic Attachments
            16 => 11, // Compensator - Generic Attachments
            17 => 7, // Angled Foregrip - Magpul
            18 => 11, // Vaccum Barrel - Generic Attachments
            19 => 7, // Short Stock - Magpul
            20 => 7, // Skeleton Stock - Magpul
        ];
        $attachment_seller_map = [
            1 => 1, // Red Dot Sight - Brownells
            2 => 1, // Suppressor - Brownells
            3 => 1, // Extended Magazine - Brownells
            4 => 1, // Laser Sight - Brownells
            5 => 1, // Foregrip - Brownells
            6 => 1, // Collapsible Stock - Brownells
            7 => 1, // Fixed Stock - Brownells
            8 => 1, // 4x Scope - Brownells
            9 => 1, // Holographic Sight - Brownells
            10 => 1, // Bipod - Brownells
            11 => 1, // Muzzle Brake - Brownells
            12 => 1, // Flash Hider - Brownells
            13 => 1, // Drum Magazine - Brownells
            14 => 1, // Tactical Light - Brownells
            15 => 1, // Grip Tape - Brownells
            16 => 1, // Compensator - Brownells
            17 => 1, // Angled Foregrip - Brownells
            18 => 1, // Vaccum Barrel - Brownells
            19 => 1, // Short Stock - Brownells
            20 => 1, // Skeleton Stock - Brownells
        ];

        // Update attachments with manufacturer_id and seller_id
        foreach ($attachment_manufacturer_map as $attachment_id => $manufacturer_id) {
            DB::table('attachments')->where('id', $attachment_id)->update([
                'manufacturer_id' => $manufacturer_id,
                'seller_id' => $attachment_seller_map[$attachment_id] ?? 7,
            ]);
        }
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
