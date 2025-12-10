<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
    public function getById(int $weaponId)
    {

        $weapon = DB::table('weapons')->where('id', $weaponId)->first();


        if (isset($weapon->image_blob)) {
            $weapon->image_base64 = base64_encode($weapon->image_blob);
            unset($weapon->image_blob);
        }

        $reviews = DB::table('reviews')
            ->where('weapon_id', $weaponId)
            ->get();

        $avgRating = $reviews->avg('rating');

        return Inertia::render('ProductPreview', [
            'weapon' => $weapon,
            'avgRating' => $avgRating,
            'reviews' => $reviews,
        ]);
    }


    public function getByQuery(Request $request)
    {
        $qWeaponName = trim((string) $request->query('name', ''));
        $qRofUpper = trim((string) $request->query('rate_of_fire_upperlimit', ''));
        $qRofLower = trim((string) $request->query('rate_of_fire_lowerlimit', ''));
        $qPowerUpper = trim((string) $request->query('power_upperlimit', ''));
        $qPowerLower = trim((string) $request->query('power_lowerlimit', ''));
        $qWeaponTypes = $request->query('weaponTypes', []);
        if (is_string($qWeaponTypes)) {
            $qWeaponTypes = [$qWeaponTypes];
        }
        $qCheckedWeaponTypes = array_values(array_filter($qWeaponTypes, fn($v) => trim((string) $v) !== ''));

        $avgReviews = DB::table('reviews')
            ->select('weapon_id', DB::raw('AVG(rating) as avg_rating'))
            ->groupBy('weapon_id');

        $weapons = DB::table('weapons')
            ->leftJoinSub($avgReviews, 'r', 'weapons.id', '=', 'r.weapon_id')
            ->select('weapons.*', 'r.avg_rating')
            ->when($qWeaponName !== '', fn($query) => $query->where('name', 'like', "%{$qWeaponName}%"))
            ->when($qRofLower !== '' && $qRofUpper === '', fn($query) => $query->where('rate_of_fire', '>=', $qRofLower))
            ->when($qRofUpper !== '' && $qRofLower === '', fn($query) => $query->where('rate_of_fire', '<=', $qRofUpper))
            ->when($qPowerLower !== '', fn($query) => $query->where('power', '>=', $qPowerLower))
            ->when($qPowerUpper !== '', fn($query) => $query->where('power', '<=', $qPowerUpper))
            ->when(count($qCheckedWeaponTypes) > 0, fn($query) => $query->whereIn('type', $qCheckedWeaponTypes))
            ->get()
            ->map(function ($weapon) {
                if (isset($weapon->image_blob)) {
                    $weapon->image_base64 = base64_encode($weapon->image_blob);
                    unset($weapon->image_blob);
                }
                return $weapon;
            });
        $count = $weapons->count();

        return Inertia::render('Separate/QueriedProducts', [
            'weapons' => $weapons,
            'message' => $qWeaponName
        ]);
    }
}
