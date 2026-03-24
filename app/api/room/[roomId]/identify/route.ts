import { NextRequest, NextResponse } from "next/server";
import firebase from '@/lib/firebaseAdmin';

// limit to how many messages they can do until they can guess the other person....
// make sure the person belongs to a room.
// validat the body would be nice, but not necessary for now.
export async function guardRoom(roomId:string):Promise<boolean> {



    return true;
}

/**
 * 
 * 
 * user is going to make a guess on whether or not the other person is a bot or not.
 */
export async function POST(
    request:NextRequest,
    {params}:{params: Promise<{roomId:string}>}
):Promise<NextResponse> {

    const body = await request.json();
    const {roomId} = await params;

    // const validRequest = await guardRoom(roomId)
    // Update the game and make sure that user can do something like update
    // set the guess and the winner
    // lock the room
    // that should be it.
    // you should later be recording player stats with SQL
    // once the game is over, the player stats will be sent and processed
    // user will either gain or lose rank from a specified game.
    const database = await firebase.ref(`/chat/rooms/${roomId}/restricted/players`);

    



    return NextResponse.json({data: 'ok'}, {status: 200});
}