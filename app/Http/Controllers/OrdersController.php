<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Stripe\StripeClient;

class OrdersController extends Controller
{
    public function placeOrder(Request $request)
    {
        $sessionId = $request->query('session_id');
        if (!$sessionId) {
            return redirect()->route('cart')->with('error', 'Invalid checkout session.');
        }

        $stripe = new StripeClient(env('STRIPE_SECRET'));
        $session = $stripe->checkout->sessions->retrieve($sessionId);

        if ($session->payment_status !== 'paid') {
            return redirect()->route('cart')->with('error', 'Payment not completed.');
        }

        $userId = $request->user()->id;
        $pendingCart = DB::table('pending_carts')->where('user_id', $userId)->first();
        $customizedWeapons = json_decode($pendingCart->trimmed_cart_data);
        $ordersToInsert = [];
        $orderId = Str::uuid()->toString();
        $orderWeapons = [];

        DB::table('orders')->insert([
            'id' => $orderId,
            'user_id' => $userId,
            'expected_arrival_date' => now()->addDays(3),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach ($customizedWeapons as $weapon) {
            $weaponId = $weapon->weapon_id;
            $attachmentIds = $weapon->attachments;
            $quantity = $weapon->quantity;
            error_log('quantity: ' . $quantity);

            $customWeaponId = Str::uuid()->toString();
            $orderWeapons[] = [
                'order_id' => $orderId,
                'custom_weapon_id' => $customWeaponId
            ];

            DB::table('custom_weapon_ids')->insert(['id' => $customWeaponId, 'weapon_id' => $weaponId]);


            foreach ($attachmentIds as $attachmentId) {
                $attachmentIdOrNull = $attachmentId === 0 ? null : $attachmentId;
                $ordersToInsert[] = [
                    'custom_weapon_id' => $customWeaponId,
                    'attachment_id' => $attachmentIdOrNull,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($ordersToInsert)) {
            DB::table('usercreated_weapons_attachments')->insert($ordersToInsert);
            DB::table('orders_weapons')->insert($orderWeapons);
        }

        DB::table('pending_carts')->where('user_id', $userId)->delete();

        return Inertia::render('Success', ['message' => 'Order has been processed successfully']);
    }
}
