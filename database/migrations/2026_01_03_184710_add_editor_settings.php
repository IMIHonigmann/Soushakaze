<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
