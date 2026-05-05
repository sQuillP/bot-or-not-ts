import { NextRequest, NextResponse } from "next/server";
import database from '@/lib/firebaseAdmin';
import { ChatRoom } from "@/types/server.types";
import firebase from '@/lib/firebaseAdmin';

const MAX_CAPACITY = 2;

async function fillRoomWithBot(roomId:string):Promise<boolean> {

    const botId = crypto.randomUUID().toString();
    const roomRef = await database.ref(`chat/rooms/${roomId}`)
        //If the item exists, run transaction 
        const connected = await roomRef.transaction((roomInfo):(ChatRoom | undefined | null)=> {
            
            if(roomInfo === null)  return roomInfo
            // Cancel transaction if room is full or the game is already finished.
            if(!roomInfo || roomInfo.occupancy >= MAX_CAPACITY || roomInfo.public?.gameFinished) return;



            // User should go first.
            const firstTurnPlayer:string = Object.keys(roomInfo.restricted.players)[0];


            return {
                ...roomInfo,
                public: {
                    ...roomInfo.public,
                    occupancy: roomInfo.public.occupancy + 1,
                    gameReady: true,
                    playerTurn: firstTurnPlayer
                },
                restricted: {
                    ...roomInfo.restricted,
                    lastMessageTimestamp: new Date().toISOString(),
                    players: {
                        ...(roomInfo.restricted.players || {}),
                        [botId]: {
                            joined: new Date().toISOString(),
                        }
                    },
                    botId,
                    isBotRoom: true
                },
                
            };
        });

        return connected.committed;
}

export async function guardRoom(roomId:string, userId: string):Promise<boolean> {
    try {

        // grab the membership and room data in parallel
        const [membership, roomData] = await Promise.all([
            firebase.ref(`/chat/rooms/${roomId}/restricted/players/${userId}`).once('value'),
            firebase.ref(`/chat/rooms/${roomId}/public`).once('value'),
        ]);
        const roomInfo:ChatRoom['public'] = roomData.val();
        // Verify the membership of player, and make sure it's their turn.
        // Otherwise, deny write access to the room.
        // User may be able to read from the room for now, that poses
        // no security threat to intruders necessarily.
        return membership.exists() && roomInfo.gameReady && roomInfo.occupancy < 2;
    } catch(error) {
        console.error('Error verifying membership: ',error);
        console.log('Unable to verify membership: ', userId, 'in room ', roomId);
        return false;
    }
}

async function validateRequest(roomId:string):Promise<boolean> {
    const roomInfo = await database.ref(`chat/rooms/${roomId}`).once('value');

    if(roomInfo.exists() === false) {
        console.log("room does not exist. Cannot poll for bot.");
        return false;
    }


    return true;
}



/**
 * We need to figure out a probability
 * whether or not it's time to fill room with a bot.
 * 
 * TODO: 
 * PROTECT THIS ROUTE
 * 
 * Make sure that polling can only be done by users
 * who belong to that room?
 * 
 * The entire point of polling is to just add a bot when polled
 * enough times. 
 * @param _ 
 * @param param1 
 * @returns 
 */
const PROBABILITY_OF_BOT = 0.75;

export async function GET(_:NextRequest, 
    {params}:{params: Promise<{roomId:string}>}
): Promise<NextResponse> {

    const {roomId} = await params;

    if(Math.random() < 3) {
        console.log('decided to fill room with a bot. Room id: ', roomId);
        // await fillRoomWithBot(roomId);
        console.log("room is now filled with a bot...");
    }


    return NextResponse.json({data:'awaiting player...'}, {status: 200});
}