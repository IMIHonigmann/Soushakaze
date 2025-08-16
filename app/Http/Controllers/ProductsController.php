<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
    public function getByQuery(Request $request)
    {
        $qWeaponName = $request->query('name');
        $qWeaponType = $request->query('type');
        $weapons = DB::table('weapons')
            ->when($qWeaponName !== '', function ($query) use ($qWeaponName) {
                return $query->where('name', 'like', '%' . $qWeaponName . '%');
            })
            ->when($qWeaponType !== '', function ($query) use ($qWeaponType) {
                return $query->where('type', 'like', '%' . $qWeaponType . '%');
            })
            ->get();
        $count = $weapons->count();

        return Inertia::render('QueriedProducts', [
            'weapons' => $weapons,
            'message' => "Found {$count} products for the query with the weapon name: '" . ($qWeaponName ? $qWeaponName : '') . "' and " . ($qWeaponType ? "the weapon of type '{$qWeaponType}'" : "no specific weapon type")
        ]);
    }
}
