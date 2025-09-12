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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('profile', function (Request $request) {
        return Inertia::render('Profile', [
            'user' => $request->user(),
        ]);
    })->name('profile');

    Route::get('orderHistory', function (Request $request) {
        $user = $request->user();
        $orders = DB::table('orders')->where('user_id', $user->id)->get();
        return Inertia::render('OrderHistory', ['orders' => $orders, 'user' => $user]);
    })->name('order-history');
});


Route::get('/customizer/{weaponId}', [CustomizerController::class, 'index'])->name('customizer');
Route::post('/customizer', [CustomizerController::class, 'store'])->name('customizer.store');

Route::get('cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('products', [ProductsController::class, 'getAll'])->name('products');

Route::get('/products/search', [ProductsController::class, 'getByQuery'])->name('queried-products');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
