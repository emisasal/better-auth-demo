import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/sign-out-button"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }
  console.log("Session:", session)
  const isEmailVerified = session.user.emailVerified

  return (
    <main className="flex justify-center items-center w-full h-screen gap-6">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <h2>Welcome {session.user.name}!</h2>
        <h2>{session.user.email}</h2>

        {!isEmailVerified && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <p className="text-sm">
              ⚠️ Your email is not verified.{" "}
              <Link href="/verify-email" className="underline font-bold">
                Verify now
              </Link>
            </p>
          </div>
        )}

        {isEmailVerified && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
            <p className="text-sm">✓ Email verified</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href={"/public-page"} className="underline">
            Public Page
          </Link>

          <Link href={"/private-page"} className="underline">
            Private Page
          </Link>
        </div>

        <SignOutButton />
      </div>
    </main>
  )
}
