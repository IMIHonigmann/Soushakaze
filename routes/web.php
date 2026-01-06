<?php

use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use function Laravel\Prompts\select;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/checkout', function (Request $request) {
        $user = $request->user();

        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        $cartItems = $request->input('cart', []);
        $processedCart = [];
        $weaponId_attachments = [];

        for ($i = 0; $i < count($cartItems); $i++) {
            $item = $cartItems[$i];
            if (isset($item)) {
                if (preg_match('/^(.+?):(.+?):(.+)$/', $item, $matches)) {
                    $quantity = $matches[1];
                    $weaponId = $matches[2];
                    $urlDecoded = urldecode($matches[3]);
                    $decodedAttachments = json_decode($urlDecoded, true);

                    foreach ($decodedAttachments as $attachment) {
                        $attachmentIds[] = $attachment['id'];
                    }

                    $attachmentPrice = DB::table('attachments')->whereIn('id', $attachmentIds)->sum('price_modifier');
                    $weapon = DB::table('weapons')->where('id', $weaponId)->first();
                    $modifiedPrice = $weapon->price + $attachmentPrice;

                    $processedCart[$i] = [
                        'weapon_name' => $weapon->name,
                        'attachments' => $decodedAttachments,
                        'serverside_modified_price' => $modifiedPrice,
                        'quantity' => $quantity
                    ];

                    $weaponId_attachments[$i] = [
                        'weapon_id' => $weapon->id,
                        'attachments' => $attachmentIds,
                        'quantity' => $quantity
                    ];
                }
            }
        }

        if (empty($cartItems)) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        $lineItems = [];
        foreach ($processedCart as $item) {
            $attachmentsList = '';
            $attachmentNames = array_map(fn($att) => $att['name'] ?? '', $item['attachments']);
            $attachmentsList = implode(', ', array_filter($attachmentNames, fn($name) => strtolower($name) !== 'factory issue'));

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $item['weapon_name'] ?? 'Custom Weapon',
                        'description' => !empty($attachmentsList)
                            ? 'Attachments: ' . $attachmentsList
                            : 'Base weapon',
                    ],
                    'unit_amount' => round(($item['serverside_modified_price'] ?? 999999999) * 100),
                ],
                'quantity' => $item['quantity'] ?? 1,
            ];
        }

        $cartId = DB::table('pending_carts')->insertGetId([
            'id' => uuid_create(),
            'user_id' => $user->id,
            'trimmed_cart_data' => json_encode($weaponId_attachments),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $user->checkout($lineItems, [
            'success_url' => route('place-order') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout-cancel'),
            'customer_update' => ['address' => 'auto'],
            'metadata' => [
                'cart_id' => $cartId,
            ]
        ]);
    })->name('checkout');

    Route::get('/checkout/success', function () {
        return Inertia::render('Success');
    })->name('checkout-success');

    Route::get('/checkout/cancel', function () {
        return Inertia::render('Cancel');
    })->name('checkout-cancel');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', function (Request $request) {
        return Inertia::render('Profile/Profile', [
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

        return Inertia::render('Profile/OrderHistory', ['orders' => $orders, 'user' => $user]);
    })->name('order-history');

    Route::get('composeReview', function (Request $request) {
        $weapon = DB::table('weapons')->join('sellers', 'seller_id', '=', 'sellers.id')->where('weapons.id', $request->query('weaponId'))->select('weapons.*', 'sellers.name as seller_name')->first();

        return Inertia::render('ComposeReview', [
            'weapon' => $weapon
        ]);
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

    Route::get('placeOrder', [OrdersController::class, 'placeOrder'])->name('place-order');


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

Route::get('editor/{weaponId}', [CustomizerController::class, 'editor'])->name('editor');

Route::post('/sendNewEditorValues', [CustomizerController::class, 'sendnewEditorValues'])->name('send_new_editor_values');

Route::post('/sendAttachmentModelHierarchy', [CustomizerController::class, 'setAttachmentModelHierarchy'])->name('sendAttachmentModelHierarchy');

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
    return Inertia::render('Separate/FrontPage');
})->name('front-page');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
