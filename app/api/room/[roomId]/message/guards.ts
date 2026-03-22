import firebase from '@/lib/firebaseAdmin';


// Make sure that non-members cannot send messages
// Make sure that whoever's turn it is to make sure only they can go next.
// make sure that they're not sending too much data through the server...
// we can also enforce this on the frontend as well. Maybe 500 characters at most
export async function guardRoom(roomId:string, userId: string):Promise<boolean> {
    try {
        // const room = await firebase.ref(`/chat/rooms/${roomId}/restricted/players/${userId}`);
        // const roomDetails = await room.once('value');
        // return roomDetails.exists();
        const [membership, currentPlayer] = await Promise.all([
            firebase.ref(`/chat/rooms/${roomId}/restricted/players/${userId}`).once('value'),
            firebase.ref(`/chat/rooms/${roomId}/public/playerTurn`).once('value')
        ]);
        console.log(membership.val(), currentPlayer.val())
        return membership.exists() && currentPlayer.val() === userId;
    } catch(error) {
        console.error('Error verifying membership: ',error);
        console.log('Unable to verify membership: ', userId, 'in room ', roomId);
        return false;
    }
}