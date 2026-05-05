
import { auth, signIn, signOut } from "@/auth"
import { Check, LogOut } from "lucide-react";
 
const Google = ()=> (
  <div>
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  </div>
)


export default async function SignIn() {

  const session = await auth();
// use this font::: "JetBrains Mono", monospace

  if(session) {
    return (
      <div className="bg-card-bg mt-5 border-2 rounded-xl border-[#1ae6d5]/30 cursor-pointer p-4 flex justify-between">
        <div className="flex gap-3">
          <Check color="green"/>
          <p className="text-gray-500">Signed in as {session.user?.name ?? 'unknown'}</p>
        </div>
        <form action={async ()=> {
            "use server"
            await signOut();
        }}>
          <button className="text-gray-400 text-xs cursor-pointer"> <LogOut size={20} className="inline" /> sign out</button>
        </form>
      </div>
    )
  }


  return (
    <>
    <div className="flex items-center gap-3 pt-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className='w-full '>

            <form
              action={async () => {
                "use server"
                await signIn("google")
              }}
            >
              <button 
                className=' bg-card-bg mt-5 flex items-center justify-center gap-2 text-white w-full p-4 rounded-lg cursor-pointer transition hover:bg-blue-700' 
                type="submit"
              >
                <Google /> 
                <span>Sign in with Google</span>
              </button>
            </form>
        </div>
    </>
  )
} 

