import { Zap, Bot, User, Trophy } from "lucide-react";
export default function Home() {
  return (
   <main className="h-screen flex items-center justify-center">
      <section className="w-full md:max-w-[600px] mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Bot className="mr-3 mb-4 text-teal" size={64} />
          <p className="text-center text-gray-400 text-lg">Or</p>
          <User className="ml-3 mb-4 text-purple" size={64} />
        </div>
        <h1 className='text-4xl font-bold text-center mb-4'>
          <span className="text-teal">Bot&nbsp;</span> 
          <span className="text-gray-400">or&nbsp;</span> 
          <span className="text-purple">Not&nbsp;</span>
          <span>?</span>
        </h1>
        <p className='text-center text-gray-400 text-lg '>You&apos;ll be matched with a mystery partner. Chat with them, then guess — are you talking to a real person or an AI?</p>
        <div className="my-5 flex items-center justify-center gap-4">
          <div className="w-40 py-3 text-center rounded-lg bg-card-bg border-card-border border-2">
            <Zap className="mx-auto mb-2 text-teal" size={32} />
            <p className="text-gray-400">Competitive</p>
          </div>
          <div className="w-40 py-3 text-center rounded-lg bg-card-bg border-card-border border-2">
              <Bot className="mx-auto mb-2 text-teal" size={32} />
            <p className="text-gray-400">Make your guess</p>
          </div>
          <div className="w-40 py-3 text-center rounded-lg bg-card-bg border-card-border border-2">
            <User className="mx-auto mb-2 text-teal" size={32} />
            <p className="text-gray-400">Become ranked</p>
          </div>
        </div>
        <div className="flex flex-col">
          <button className="text-bg-primary font-bold mt-4 py-4 rounded-lg bg-teal cursor-pointer">Start Chatting</button>
          <button className="mt-4 py-2 rounded-lg transition cursor-pointer hover:bg-purple text-gray-400 hover:text-teal"> <Trophy className="inline-block mr-2" size={15} />View Leaderboard</button>
        </div>

      </section>
   </main>
  );
}
