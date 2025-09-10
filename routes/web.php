<?php

use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\ProductsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::get('/customizer/{weaponId}', [CustomizerController::class, 'index'])->name('customizer');
Route::post('/customizer', [CustomizerController::class, 'store'])->name('customizer.store');

Route::get('cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('products', [ProductsController::class, 'getAll'])->name('products');

Route::get('/products/search', [ProductsController::class, 'getByQuery'])->name('queried-products');


Route::post('placeOrder', function (Request $request) {
    $customizedWeapons = $request->weaponid_attachments;
    $ordersToInsert = [];
    $userId = $request->user()->id;
    $orderId = Str::uuid()->toString();
    $orderWeapons = [];
        DB::table('orders')->insert([
            'id' => $orderId,
            'user_id' => $userId,
            'expected_arrival_date' => now()->addDays(3),
        ]);


    foreach ($customizedWeapons as $weapon) {
        $weaponId = $weapon['weapon_id'];
        $attachmentIds = $weapon['attachment_ids'];
        $quantity = $weapon['quantity'];
        error_log('quantity: ' . $quantity);

        $customWeaponId = Str::uuid()->toString();
            $orderWeapons[] = [
                'order_id' => $orderId,
                'custom_weapon_id' => $customWeaponId
            ];
        DB::table('custom_weapon_ids')->insert(['id' => $customWeaponId]);
       foreach ($attachmentIds as $attachmentId) {
            $attachmentIdOrNull = $attachmentId === 0 ? null : $attachmentId;
            $ordersToInsert[] = [
                'custom_weapon_id' => $customWeaponId,
                'weapon_id' => $weaponId,
                'attachment_id' => $attachmentIdOrNull,
                'created_at' => now(),
                'updated_at' => now(),
            ];

        }
    }
    if (!empty($ordersToInsert)) {
        DB::table('usercreated_weapons_attachments')->insert($ordersToInsert);
        DB::table('orders_weapons')->insert($orderWeapons);
    }

    return Inertia::render('OrderPlaced', ['message' => 'Order has been processed successfully']);
})->name('place-order');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
