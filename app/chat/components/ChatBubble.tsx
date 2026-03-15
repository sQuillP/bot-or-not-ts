import { CircleQuestionMark } from "lucide-react";


interface IChatBubbleProps {
    text: string;
    isMe: boolean;
}

export default function ChatBubble({ text, isMe }: IChatBubbleProps) {

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start`}>
            { isMe === false && (
                <div className={`rounded-full p-2 bg-gray-800 mr-2`}>
                    <CircleQuestionMark size={15} className="text-teal"/>       
                </div>
            )
            }
            <div className={`p-3 rounded-lg text-sm max-w-[40vw] ${isMe ? 'bg-teal text-black' : 'bg-gray-800 text-white'}`}>
                {text}
            </div>
        </div>
    )
}