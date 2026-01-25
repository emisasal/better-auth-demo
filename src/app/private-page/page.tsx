import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-bold text-3xl">This is a restricted page</h1>
        <Link href={"/"} className="underline">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
