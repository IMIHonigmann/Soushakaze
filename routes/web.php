<?php

use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', function (Request $request) {
        return Inertia::render('Profile', [
            'user' => $request->user(),
        ]);
    })->name('profile');

    Route::get('/profile/orders', function (Request $request) {
        $user = $request->user();
        $orders = DB::table('orders')
            ->where('orders.user_id', $user->id)
            ->select('orders.*')
            ->get()
            ->map(function ($order) {
                // Get all weapons for this order
                $weapons = DB::table('orders_weapons')
                    ->join('custom_weapon_ids', 'orders_weapons.custom_weapon_id', '=', 'custom_weapon_ids.id')
                    ->join('weapons', 'custom_weapon_ids.weapon_id', '=', 'weapons.id')
                    ->where('orders_weapons.order_id', $order->id)
                    ->select(
                        'weapons.id as weapon_id',
                        'weapons.name as name',
                        'weapons.price as price',
                        'weapons.seller_id as seller_id',
                        'weapons.manufacturer_id as manufacturer_id',
                        'weapons.type as type',
                        'custom_weapon_ids.id as custom_weapon_id',
                        'custom_weapon_ids.*'

                    )
                    ->get()
                    ->map(function ($weapon) {
                        $attachments = DB::table('usercreated_weapons_attachments')
                            ->leftJoin('attachments', 'usercreated_weapons_attachments.attachment_id', '=', 'attachments.id')
                            ->where('usercreated_weapons_attachments.custom_weapon_id', $weapon->custom_weapon_id)
                            ->select(
                                'attachments.id as id',
                                'attachments.name as name',
                                'attachments.area as area',
                                'attachments.price_modifier as price_modifier'
                            )
                            ->get();

                        $weapon->attachments = $attachments;
                        $weapon->modified_price = $weapon->price + $weapon->attachments->sum('price_modifier');
                        return $weapon;
                    });

                $order->weapons = $weapons;
                foreach ($order->weapons as $weapon) {
                    foreach ($weapon->attachments as $attachment) {
                    }
                }
                return $order;
            });

        return Inertia::render('OrderHistory', ['orders' => $orders, 'user' => $user]);
    })->name('order-history');

    Route::get('composeReview', function (Request $request) {
        return Inertia::render('ComposeReview');
    })->name('compose-review');

    Route::post('sendReview', function (Request $request) {
        $validated = $request->validate([
            'weapon_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'review' => 'required|string|max:1000',
        ]);

        DB::table('reviews')->insert([
            'user_id' => $request->user()->id,
            'weapon_id' => $validated['weapon_id'],
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'review' => $validated['review'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('order-history')->with('success', 'Review submitted successfully.');
    })->name('send-review');

    Route::post('placeOrder', [OrdersController::class, 'placeOrder'])->name('place-order');


    Route::post('addImage', function (Request $request) {
        $validated = $request->validate([
            'image' => 'required|string',
            'weapon_id' => 'required|integer'
        ]);

        $imageData = $validated['image'];
        $weaponId = $validated['weapon_id'];

        if (preg_match('/^data:(.*);base64,(.*)$/', $imageData, $matches)) {
            $binary = base64_decode($matches[2]);
        } else {
            $binary = base64_decode($imageData);
        }


        DB::table('weapons')->where('id', $weaponId)->update([
            'image_blob' => $binary,
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Image uploaded.');
    })->name('add-image');
});

Route::get('/customizer/{weaponId}', [CustomizerController::class, 'index'])->name('customizer');
Route::post('/customizer', [CustomizerController::class, 'store'])->name('customizer.store');

Route::get('cart', function () {
    return Inertia::render('Cart', ['freeShippingThreshold' => 3599.99, 'standardShippingCost' => 4.90, 'premiumShippingExtraCost' => 10]);
})->name('cart');
Route::get('wishlist', function () {
    return Inertia::render('Wishlist');
})->name('wishlist');

Route::get('products', [ProductsController::class, 'getAll'])->name('products');

Route::get('/products/search', [ProductsController::class, 'getByQuery'])->name('queried-products');
Route::get('/products/{weaponId}', [ProductsController::class, 'getById'])->name('product.show');


Route::get('morphTest', function (Request $request) {
    return Inertia::render('MorphingLogo');
})->name('morph-test');

Route::get('frontpage', function (Request $request) {
    return Inertia::render('FrontPage');
})->name('front-page');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
