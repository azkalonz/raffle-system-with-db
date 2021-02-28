<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|exists:users,email",
            "password" => "required",
        ]);
        if (!Auth::attempt($request->only(["email", "password"]))) {
            return response()->json([
                "message" => "Unauthorized",
            ]);
        }

        $user = $request->user();

        $user->access_token = $user->createToken("Access Token")->accessToken;

        return response()->json($user);
    }
}
