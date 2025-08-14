<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function getAll()
    {
        $weapons = DB::table('weapons')->get();
        $count = $weapons->count();

        return Inertia::render('Products', [
            'weapons' => $weapons,
            'message' => "Found {$count} products"
        ]);
    }
    public function getByQuery($searchQuery)
    {
        $weapons = DB::table('weapons')
            ->where('name', 'like', '%' . $searchQuery . '%')
            ->get();
        $count = $weapons->count();

        return Inertia::render('QueriedProducts', [
            'searchQuery' => $searchQuery,
            'weapons' => $weapons,
            'message' => "Found {$count} products for query '{$searchQuery}'"
        ]);
    }
}
