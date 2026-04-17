import { NextRequest, NextResponse } from "next/server";
import database from '@/lib/firebaseAdmin';
import crypto from 'crypto'
import { ChatRoom } from "@/types/server.types";




// Create a single room in firebase db.
async function createRoom(generatedUserID:string):Promise<string> {
     const roomRef = await database.ref('chat/rooms');

    const chatRoomData:ChatRoom = {
        public: {
            messages: {},
            occupancy: 1,
            gameFinished: false,
            winner: '',
            gameReady: false,
            currentTurn: ''
        },
        restricted: {
            isBotRoom: false,
            lastMessageTimestamp: '',
            players: {
                [generatedUserID]: {
                    // more player information here
                    joined: new Date().toISOString()
                }
            }
        }
    };

    const refId = await roomRef.push(chatRoomData);
    if(refId.key === null) {
        throw new Error('Unable to generate key for room');
    }

    return refId.key
}


async function listRooms(): Promise<Record<string, ChatRoom> | null> {
    const rooms = database.ref('chat/rooms');
    const snapshot = await rooms.orderByChild('public/occupancy')
    .endAt(1)
    .once('value');
    const roomList:Record<string, ChatRoom> = snapshot.val();
    return roomList
}


// Returns true if a connection has been made to a specific room.
// THis means that the room is available to share for a specific user now.
async function establishConnection(roomId:string, userId:string):Promise<boolean> {
    try {
        console.log('google id', process.env.AUTH_GOOGLE_ID, 'secret', process.env.AUTH_GOOGLE_SECRET)
        const MAX_CAPACITY = 2;
        const roomRef = await database.ref(`chat/rooms/${roomId}`)

        //If the item exists, run transaction 
        const connected = await roomRef.transaction((roomInfo):(ChatRoom | undefined | null)=> {
            if(roomInfo === null)  return roomInfo
            // Cancel transaction if room is full or the game is already finished.
            if(!roomInfo || roomInfo.occupancy >= MAX_CAPACITY || roomInfo.public?.gameFinished) return;


            //decide on who's going first? 
            const parity = Math.floor(Math.random()* 2);
            let firstTurnPlayer:string;
            if(parity === 0) {
                firstTurnPlayer = userId;
                console.log('first players choice');
            } else {
                firstTurnPlayer = Object.keys(roomInfo.restricted.players)[0];
                console.log("second players choice")
            }


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
                        [userId]: {
                            joined: new Date().toISOString(),
                        }
                    }
                }
            };
        });

        return connected.committed;

    } catch(error) {
        console.log(error);
        return false;
    }
}



/**
 * @description Lists all the available rooms, then attempts to connect to the first
 * available room. If that connection is successful, then return that room ID immediately
 * otherwise, keep searching.
 * @returns 
 */
async function connectUserToRoom(userId:string):Promise<string> {
    const roomObject = await listRooms();
    if(roomObject === null) {
        return '';
    }
    for(const room of Object.keys(roomObject)) {
        if(await establishConnection(room, userId)) {
            return room;
        }
    }
    return '';
}




/**
 * @description returns a valid room ID to the consumer, this will be used as reference
 * to the current public chat room data. website can now connect to the room and see all the 
 * chats.
 * @param _ 
 * @returns 
 */
export async function GET(_:NextRequest):Promise<NextResponse> {

    // Room is initialized now,
    try {
        const userId = crypto.randomUUID();
        console.log('user id that should be added', userId);
        let roomId = await connectUserToRoom(userId);

        if(roomId === '')  {
            console.log("no rooms found, creating a new room...");
            roomId = await createRoom(userId);
        }


        return NextResponse.json({data: {roomId: roomId, userId}}, {status: 200});
    } catch(error) {
        console.error(error);
        return NextResponse.json({data:'Cannot find a room to join =('}, {status:500})
    }
}