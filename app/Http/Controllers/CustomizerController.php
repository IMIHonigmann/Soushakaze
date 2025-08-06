<?php
namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\YourModel; // Replace with your actual model

class CustomizerController extends Controller
{
    // GET: Fetch data from the database
    public function index()
    {
        $data = Attachment::all(); // Adjust query as needed
        return Inertia::render('Customizer', ['data' => $data]);
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
