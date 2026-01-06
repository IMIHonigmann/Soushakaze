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
            ->orderBy('price_modifier', 'asc')
            ->select('attachments.*')
            ->get()
            ->groupBy('area')
            ->map(function ($group) {
                return $group->values();
            });
        $maxPower = DB::table('weapons')->max('power');

        return Inertia::render('Separate/Customizer/Customizer', [
            'weapon' => $weapon,
            'maxPower' => $maxPower,
            'attachments' => $attachments,
            'query' => $request->query(),
            'renderEditor' => false
        ]);
    }

    public function editor(Request $request, int $weaponId)
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
            ->orderBy('price_modifier', 'asc')
            ->select('attachments.*')
            ->get()
            ->groupBy('area')
            ->map(function ($group) {
                return $group->values();
            });

        $maxPower = DB::table('weapons')->max('power');

        $area_displays = DB::table('weapon_area_display')->where('weapon_id', $weaponId)->get();
        $attachment_models = DB::table('weapon_attachment_model')->where('weapon_id', $weaponId)->leftJoin('attachments', 'attachment_id', '=', 'attachments.id')->select('weapon_attachment_model.model_name', 'attachments.name as attachment_name')->get()->groupBy('attachment_name')->map(function ($group) {
            return $group->pluck('model_name');
        });

        return Inertia::render('Separate/Customizer/Customizer', [
            'weapon' => $weapon,
            'maxPower' => $maxPower,
            'attachments' => $attachments,
            'query' => $request->query(),
            'areaDisplays' => $area_displays,
            'attachmentModels' => $attachment_models,
            'renderEditor' => true
        ]);
    }

    public function sendNewEditorValues(Request $request)
    {
        $validated = $request->validate([
            'weapon_id' => 'required|integer|exists:weapon_id',
            'target_x' => 'required|numeric',
            'target_y' => 'required|numeric',
            'target_z' => 'required|numeric',
            'position_x' => 'required|numeric',
            'position_y' => 'required|numeric',
            'position_z' => 'required|numeric',
        ]);

        $weaponId = $validated['weapon_id'];

        DB::table('weapon_area_display')
            ->updateOrCreate(
                ['weapon_id' => $weaponId],
                [
                    'target_x' => $validated['target_x'],
                    'target_y' => $validated['target_y'],
                    'target_z' => $validated['target_z'],
                    'position_x' => $validated['position_x'],
                    'position_y' => $validated['position_y'],
                    'position_z' => $validated['position_z'],
                ]
            );

        return response()->json([
            'success' => true,
            'message' => 'Editor values saved successfully'
        ]);
    }

    public function setAttachmentModelHierarchy(Request $request)
    {
        $validated = $request->validate([
            'weapon_id' => 'required|integer|exists:weapons,id',
            'attachment_ids' => 'nullable|array',
            'model_names' => 'required|array',
        ]);

        DB::transaction(function () use ($validated) {
            $attachmentIds = $validated['attachment_ids'] ?? [];
            foreach ($validated['model_names'] as $index => $model_name) {
                DB::table('weapon_attachment_model')->insert(
                    [
                        'weapon_id' => $validated['weapon_id'],
                        'attachment_id' => $attachmentIds[$index] ?? null,
                        'model_name' => $model_name,
                    ]
                );
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Attachment model hierarchy updated successfully'
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
