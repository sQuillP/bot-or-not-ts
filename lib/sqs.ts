import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";



/**
 * @description - send a message to SQS to invoke bot from AWS lambda.
 * @param {messages} - conversation history in the chat room.
 */
export async function queueBot(roomId:string):Promise<void> {
    const client = new SQSClient({
        region:'us-east-2',
        credentials: {
            accessKeyId: process.env.AWS_BOTORNOT_ACCESS_KEY || '',
            secretAccessKey: process.env.AWS_BOTORNOT_SECRET_ACCESS_KEY || ''
        }
    });

    const command = new SendMessageCommand({
        QueueUrl: process.env.AWS_BOTORNOT_QUEUE_URL,
        MessageBody: JSON.stringify({
            roomId,
        })
    });
    await client.send(command);
}