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

        $qWeaponName = trim((string) $request->query('name', ''));
        $qWeaponType = trim((string) $request->query('type', ''));
        $qRofUpper = trim((string) $request->query('rate_of_fire_upperlimit', ''));
        $qRofLower = trim((string) $request->query('rate_of_fire_lowerlimit', ''));
        $qPowerUpper = trim((string) $request->query('power_upperlimit', ''));
        $qPowerLower = trim((string) $request->query('power_lowerlimit', ''));

        $weapons = DB::table('weapons')
            ->when($qWeaponName !== '', fn($query) => $query->where('name', 'like', "%{$qWeaponName}%"))
            ->when($qWeaponType !== '', fn($query) => $query->where('type', 'like', "%{$qWeaponType}%"))
            ->when($qRofLower !== '' && $qRofUpper === '', fn($query) => $query->where('rate_of_fire', '>=', $qRofLower))
            ->when($qRofUpper !== '' && $qRofLower === '', fn($query) => $query->where('rate_of_fire', '<=', $qRofUpper))
            ->when($qPowerLower !== '', fn($query) => $query->where('power', '>=', $qPowerLower))
            ->when($qPowerUpper !== '', fn($query) => $query->where('power', '<=', $qPowerUpper))
            ->get();
        $count = $weapons->count();

        return Inertia::render('QueriedProducts', [
            'weapons' => $weapons,
            'message' => "Found {$count} product" . ($count > 1 ? 's' : '') . " for the query with the weapon name: '" . ($qWeaponName ? $qWeaponName : '') . "' and " . ($qWeaponType ? "the weapon of type '{$qWeaponType}'" : "no specific weapon type")
        ]);
    }
}
