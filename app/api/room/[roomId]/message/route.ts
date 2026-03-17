import { NextRequest, NextResponse } from "next/server";
import type { RoomMessage } from "@/types/server.types";
import firebase from '@/lib/firebaseAdmin';

export async function POST(
    request:NextRequest, 
    { params }: { params: Promise<{ roomId: string }> }):Promise<NextResponse> {
    try {
        const body:RoomMessage = await request.json();
        const {roomId} = await params;

        console.log('in room message::: ', body, roomId);

        // we can verify that this person belongs to the room.
        // append the message to the list, update the turn

        const dbRef = firebase.ref(`/chat/rooms/${roomId}/public/messages`);
        await dbRef.push(body);

        return NextResponse.json({data:'ok'}, {status:200});
    } catch(error) {
        return NextResponse.json({data: 'Server broke'}, {status: 500});
    }
}