<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Winner;
use Illuminate\Http\Request;

class WinnerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Winner::orderBy('id', 'desc')->get()->map(function ($win) {
            $win->participant;
            $win->participant->school;
            $win->item;
            return $win;
        }));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
            "participant_id" => "exists:participants,id",
        ]);

        if (!$request->item_id) {
            $request->validate([
                "item_name" => "required"
            ]);
            $item = Item::create(["name" => $request->item_name]);
            $id = $item->id;
        } else {
            $id = $request->item_id;
        }
        $the_item = Item::where("id", $id)->first();
        Item::where("id", $id)->update(["quantity" => $the_item->quantity - 1]);

        $winner = Winner::create(["participant_id" => $request->participant_id, "item_id" => $id]);
        $winner = Winner::find($winner->id);
        $winner->participant;
        $winner->participant->school;
        $winner->item;
        return response()->json($winner);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy()
    {
        Winner::truncate();
        return true;
    }
}
