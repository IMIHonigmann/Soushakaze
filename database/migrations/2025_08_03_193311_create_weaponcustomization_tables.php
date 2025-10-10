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
        Schema::create('custom_weapon_ids', function (Blueprint $table) {
            $table->uuid('id')->primary();
        });
        Schema::create('weapons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer(column: 'rate_of_fire');
            $table->enum('type', ['handgun', 'smg', 'shotgun', 'blade']);
            $table->integer('power');
            $table->decimal('price', 10, 2);
            $table->binary('image_blob')->nullable();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE weapons MODIFY image_blob MEDIUMBLOB");

        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->enum('area', [
                'muzzle', // suppressor, compensator, etc.
                'scope', // red dot, acog, etc.
                'magazine', // extended, drum, etc.
                'grip', // vertical, angled, etc.
                'stock', // tactical, heavy, etc.
                'barrel', // long, short, etc.
                'laser', // laser sight
                'flashlight', // flashlight
                'bipod', // bipod
                'underbarrel',
                'other', // fallback
            ]);
            $table->binary('image_blob')->nullable();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE weapons MODIFY image_blob MEDIUMBLOB");

        Schema::create('weapons_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weapon_id')->constrained('weapons')->onDelete('cascade');
            $table->foreignId('attachment_id')->constrained('attachments')->onDelete('cascade');
            $table->timestamps();
        });


        Schema::create('usercreated_weapons_attachments', function (Blueprint $table) {
            $table->id();
            $table->uuid(column: 'custom_weapon_id');
            $table->foreign('custom_weapon_id')
                ->references('id')
                ->on('custom_weapon_ids')
                ->onDelete('cascade');
            $table->foreignId('weapon_id')->constrained('weapons')->onDelete('cascade');
            $table->foreignId('attachment_id')->nullable()->constrained('attachments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weapons');
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('weapons_attachments');
        Schema::dropIfExists('usercreated_weapons_attachments');
    }
};
