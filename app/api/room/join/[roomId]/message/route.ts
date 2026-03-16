import { NextRequest, NextResponse } from "next/server";
import type { RoomMessage } from "@/types/server.types";

export async function POST(
    request:NextRequest, 
    { params }: { params: Promise<{ roomId: string }> }):Promise<NextResponse> {
    try {
        const body:RoomMessage = await request.json();
        const {roomId} = await params;

        // append the message to the list, update the turn
        // of the game.
        // const roomData = 


        return NextResponse.json({data:'ok'}, {status:200});
    } catch(error) {
        return NextResponse.json({data: 'Server broke'}, {status: 500});
    }
}