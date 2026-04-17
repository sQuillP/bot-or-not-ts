// Please install OpenAI SDK first: `npm install openai`
import { getDatabase } from 'firebase-admin/database';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import OpenAI from "openai";
import fs from 'fs';
import { SQSEvent, Context, SQSRecord} from 'aws-lambda';


interface SQSMessageBody {
  roomId:string;
}

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

const db = getDB();

// Please iterate and improve upon this prompt.....
const PROMPT = `
You are a bot that is trying to convince a user that a real human is speaking to them. Your response 
is sent and recorded via direct message. Please feel free to use improper grammar, incorrect spelling in order to fool the person on the other
side of the conversation.
`;


/**
 * @description - Return the literal string that deepseek responds back with.
 */
// export async function deepseek(promptMessages) {
//   console.log("What are the messages::: ", JSON.stringify(promptMessages));
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: PROMPT }, ...promptMessages],
//     model: "deepseek-chat",
//   });
//   return completion.choices[0].message.content;
// }


function getDB() {

  const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccount.json', 'utf-8'));
  const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  : getApp();


  return getDatabase(app);
}


async function sendMessageToRoom(record:SQSRecord):Promise<void> {

  const body:SQSMessageBody = JSON.parse(record.body);
  const {roomId} = body
  const messageList = await db.ref(`/chat/rooms/${roomId}/public/messages`).once('value');
  console.log("Whats the message list", JSON.stringify(messageList));


}

async function processMessages(messages:SQSRecord[]):Promise<void> {

  // await Promise.all(messages.map(message => processMessages(message)));
  await Promise.all(messages.map(message => sendMessageToRoom(message)));
}




/**
 * There is incoming data for specific rooms
 * 
 */
export const handler = async (event: SQSEvent, _:Context)=> {

  try {
    console.log("EVENT::: ", event);
    // for(const record of event.Records) {
    //   const body:SQSMessageBody =  JSON.parse(record.body);

    // }

    console.log("reading the processed messages:::");
    await processMessages(event.Records);

    


    // Put the requests into a deepseek-readable format

  } catch(error) {
    console.error(error);
  }
}