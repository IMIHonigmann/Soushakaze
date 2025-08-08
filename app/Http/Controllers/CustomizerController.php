<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomizerController extends Controller
{
    // GET: Fetch data from the database
    public function index($weaponId)
    {
        $weapon = DB::table('weapons')
        ->where('id', $weaponId)
        ->first();
        $attachments = DB::table('weapons_attachments')
            ->where('weapon_id', $weaponId)
            ->join('attachments', 'weapons_attachments.attachment_id', '=', 'attachments.id')
            ->select('attachments.*')
            ->get();
        return Inertia::render('Customizer', [
            'weaponName' => $weapon->name,
            'weaponId' => $weapon->id,
            'attachments' => $attachments]);
    }

    // POST: Handle data sent from the customizer
    public function store(Request $request)
    {
        // Validate and save data
        $validated = $request->validate([
            'field' => 'required', // Adjust validation rules
        ]);
        // YourModel::create($validated);

        return redirect()->route('customizer');
    }
}
