<?php

use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\ProductsController;
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

Route::get('/customizer/{weaponId}', [CustomizerController::class, 'index'])->name('customizer');
Route::post('/customizer', [CustomizerController::class, 'store'])->name('customizer.store');

Route::get('cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('products', [ProductsController::class, 'getAll'])->name('products');

Route::get('/products/{searchQuery}', function () {
    return Inertia::render('QueriedProducts');
})->name('queried-products');

Route::post('placeOrder', function () {
    return view('order.confirmation', [
        'data' => 'To be implemented*'
    ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
