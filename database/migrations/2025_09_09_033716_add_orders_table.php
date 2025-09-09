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
        Schema::create('orders', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->uuid('custom_weapon_id')->nullable();
            $table->foreign('custom_weapon_id')
                  ->references('custom_weapon_id')
                  ->on('usercreated_weapons_attachments')
                  ->onDelete('set null');
            $table->string('status')->default('pending');
            $table->decimal('total_price', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
