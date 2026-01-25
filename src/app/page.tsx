import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }
  console.log("Session:", session)
  return (
    <main className="flex justify-center items-center w-full h-screen gap-6">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <h2>Welcome {session.user.name}</h2>
        <h2>{session.user.email}</h2>

        <div className="flex gap-3">
          <Link href={"/public-page"} className="underline">
            Public Page
          </Link>

          <Link href={"/private-page"} className="underline">
            Private Page
          </Link>
        </div>
      </div>
    </main>
  )
}
