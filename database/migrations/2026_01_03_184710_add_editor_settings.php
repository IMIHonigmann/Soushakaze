<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weapon_area_display', function (Blueprint $table) {
            $table->foreignId('weapon_id')->primary()->constrained();
            $table->foreignId('attachmentId')->nullable();
            $table->decimal('target_x', 10, 3);
            $table->decimal('target_y', 10, 3);
            $table->decimal('target_z', 10, 3);
            $table->decimal('position_x', 10, 3);
            $table->decimal('position_y', 10, 3);
            $table->decimal('position_z', 10, 3);
            $table->timestamps();
        });
        Schema::create('weapon_attachment_model', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weapon_id')->constrained();
            $table->foreignId('attachment_id')->nullable()->constrained();
            $table->string('model_name');
            $table->timestamps();
        });
        Schema::create('weapon_rest_transforms', function (Blueprint $table) {
            $table->foreignId('weapon_id')->primary()->constrained();
            $table->decimal('position_x', 10, 3)->default(0);
            $table->decimal('position_y', 10, 3)->default(0);
            $table->decimal('position_z', 10, 3)->default(0);
            $table->decimal('rotation_x', 10, 3)->default(0);
            $table->decimal('rotation_y', 10, 3)->default(0);
            $table->decimal('rotation_z', 10, 3)->default(0);
            $table->decimal('scale_x', 10, 3)->default(1);
            $table->decimal('scale_y', 10, 3)->default(1);
            $table->decimal('scale_z', 10, 3)->default(1);
            $table->timestamps();
        });

        DB::table('weapon_rest_transforms')->insert([
            [
                'weapon_id' => 6,
                'position_x' => 0.000,
                'position_y' => 0.000,
                'position_z' => 0.000,
                'rotation_x' => 0.000,
                'rotation_y' => 0.000,
                'rotation_z' => 0.000,
                'scale_x' => 1.000,
                'scale_y' => 1.000,
                'scale_z' => 1.000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'weapon_id' => 2,
                'position_x' => 1.500,
                'position_y' => -2.000,
                'position_z' => 3.250,
                'rotation_x' => 10.000,
                'rotation_y' => 20.000,
                'rotation_z' => 30.000,
                'scale_x' => 1.000,
                'scale_y' => 1.000,
                'scale_z' => 1.000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
