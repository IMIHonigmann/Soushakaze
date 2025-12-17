<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomizerController extends Controller
{
    public function index(Request $request, int $weaponId)
    {
        $weapon = DB::table('weapons')
            ->where('id', $weaponId)
            ->first();
        if (isset($weapon->image_blob)) {
            $weapon->image_base64 = base64_encode($weapon->image_blob);
            unset($weapon->image_blob);
        }
        $attachments = DB::table('weapons_attachments')
            ->where('weapon_id', $weaponId)
            ->join('attachments', 'weapons_attachments.attachment_id', '=', 'attachments.id')
            ->select('attachments.*')
            ->get();
        $maxPower = DB::table('weapons')->max('power');

        return Inertia::render('Separate/Customizer', [
            'weapon' => $weapon,
            'maxPower' => $maxPower,
            'attachments' => $attachments,
            'query' => $request->query(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'field' => 'required', // Adjust validation rules
        ]);

        return redirect()->route('customizer');
    }
}
