import axios from 'axios';


export async function connectToRoom():Promise<{roomId: string, userId: string}> {
    try {
        const connectionRequest = await axios.get('/api/room/join');
        return connectionRequest.data.data;
    } catch(error) {
        console.error("Error connecting to a chat room.", error);
        return {roomId: '', userId: ''};
    }
}