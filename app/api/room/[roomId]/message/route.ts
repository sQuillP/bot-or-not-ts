import { NextRequest, NextResponse } from "next/server";
import type { RoomMessage } from "@/types/server.types";
import firebase from '@/lib/firebaseAdmin';
import { guardRoom } from "./guards";

interface MessageRouteParams {
    roomId:string;
}





export async function POST(
    request:NextRequest, 
    { params }: { params: Promise<MessageRouteParams> }):Promise<NextResponse> {
    try {
        const body:RoomMessage = await request.json();
        const {roomId} = await params;
        const validRequest = true;//await guardRoom(roomId,body.from);
        console.log("is this guy really a member? ", validRequest);

        // if(validRequest === false) {
        //     return NextResponse.json({data: "Don't be ruining other people's fun...."}, {status: 403});
        // }
        

        const dbRef = firebase.ref(`/chat/rooms/${roomId}/public/messages`);
        await dbRef.push(body);

        return NextResponse.json({data:'ok'}, {status:200});
    } catch(error) {
        console.error(error);
        return NextResponse.json({data: 'Server broke'}, {status: 500});
    }
}