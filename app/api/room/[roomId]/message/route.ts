import { NextRequest, NextResponse } from "next/server";
import type { RoomMessage } from "@/types/server.types";
import firebase from '@/lib/firebaseAdmin';
import { guardRoom } from "./guards";
import { queueBot } from "@/lib/sqs";
import {auth} from '@/auth';

interface MessageRouteParams {
    roomId:string;
}





export async function POST(
    request:NextRequest, 
    { params }: { params: Promise<MessageRouteParams> }):Promise<NextResponse> {
    try {
        const session = await auth();
        console.log('what s the session in the message route: ', session);
        const body:RoomMessage = await request.json();
        const {roomId} = await params;
        const validRequest = await guardRoom(roomId,body.from);

        //perform the validation that you need.
        if(validRequest === false) {
            return NextResponse.json({data: "Don't be ruining other people's fun...."}, {status: 403});
        }
        //Add the message, process the last timestamp, find list of players...
        const [_, __, players] = await Promise.all([
            firebase.ref(`/chat/rooms/${roomId}/public/messages`).push(body),
            firebase.ref(`/chat/rooms/${roomId}/restricted/lastMessageTimestamp`).set(new Date().toISOString()),
            firebase.ref(`/chat/rooms/${roomId}/restricted/players`).once('value')
        ]);


        const otherplayer = Object.keys(players.val()).filter(userId => userId !== body.from)[0];
        await firebase.ref(`/chat/rooms/${roomId}/public/playerTurn`).set(otherplayer);

        console.log("queuing bot with this message::: ", body.message, "from user: ", body.from, "in room: ", roomId);
        const queued = await queueBot(roomId);

        console.log('queued bot successfully::: ', queued);

        return NextResponse.json({data:'message received. awaiting other players turn.'}, {status:200});
    } catch(error) {
        console.error(error);
        return NextResponse.json({data: 'Server broke =('}, {status: 500});
    }
}