import firebase from '@/lib/firebaseAdmin';

const MAX_TIME_DELAY_MS = Infinity;//10_000 + 800//30_000;


// Makes sure that user belongs to room.
// makes sure that it is currently users turn.
// checks timestamp from last message.
export async function guardRoom(roomId:string, userId: string):Promise<boolean> {
    try {
        const now = Date.now();
        const [membership, currentPlayer, lastMessageTimestamp] = await Promise.all([
            firebase.ref(`/chat/rooms/${roomId}/restricted/players/${userId}`).once('value'),
            firebase.ref(`/chat/rooms/${roomId}/public/playerTurn`).once('value'),
            firebase.ref(`/chat/rooms/${roomId}/restricted/lastMessageTimestamp`).once('value')
        ]);
        const lastTimestamp = new Date(lastMessageTimestamp.val()).getTime();

        //Verify time has not passed already. Otherwise, lock the room down.
        if(now - lastTimestamp > MAX_TIME_DELAY_MS) {
            console.log('time ran out. This endpoint is locked forever.',now - lastTimestamp);
            return false;
        }

        // Verify the membership of player, and make sure it's their turn.
        // Otherwise, deny write access to the room.
        // User may be able to read from the room for now, that poses
        // no security threat to intruders necessarily.
        return membership.exists() && currentPlayer.val() === userId;
    } catch(error) {
        console.error('Error verifying membership: ',error);
        console.log('Unable to verify membership: ', userId, 'in room ', roomId);
        return false;
    }
}