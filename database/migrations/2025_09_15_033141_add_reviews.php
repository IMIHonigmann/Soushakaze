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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->index();
            $table->uuid('weapon_id');
            $table->foreign('weapon_id')->references('id')->on('custom_weapon_ids')->onDelete('cascade');
            $table->text('review');
            $table->unsignedTinyInteger('rating');
            $table->timestamps();
        });

        DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_rating_between_1_and_5 CHECK (rating >= 1 AND rating <= 5)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
