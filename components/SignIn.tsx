
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button className='text-white' type="submit">Signin with Google</button>
    </form>
  )
} 

