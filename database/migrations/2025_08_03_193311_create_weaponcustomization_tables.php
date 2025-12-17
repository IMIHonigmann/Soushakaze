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
        Schema::create('manufacturers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        Schema::create('weapons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained();
            $table->foreignId('manufacturer_id')->constrained();
            $table->string('name');
            $table->integer(column: 'rate_of_fire');
            $table->integer('stock_quantity')->default(0);
            $table->enum('type', ['handgun', 'smg', 'shotgun', 'blade']);
            $table->integer('power');
            $table->integer('accuracy')->default(0);
            $table->integer('mobility')->default(0);
            $table->integer('handling')->default(0);
            $table->integer('extra_mags')->default(2);
            $table->integer('magsize')->default(8);
            $table->decimal('price', 10, 2);
            $table->decimal('price_modification_coefficient', 10, 2)->default(1.00);
            $table->timestamp('next_sale_startdate')->nullable();
            $table->timestamp('next_sale_enddate')->nullable();
            $table->binary('image_blob')->nullable();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE weapons MODIFY image_blob MEDIUMBLOB");

        Schema::create('custom_weapon_ids', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('weapon_id')->constrained('weapons')->onDelete('cascade');
        });

        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained();
            $table->foreignId('manufacturer_id')->constrained();
            $table->string('name');
            $table->decimal('price_modifier', 10, 2);
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
            $table->integer('power_modifier')->default(0);
            $table->integer('accuracy_modifier')->default(0);
            $table->integer('mobility_modifier')->default(0);
            $table->integer('handling_modifier')->default(0);
            $table->integer('magsize_modifier')->default(0);
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
