import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string; callbackURL?: string }
}) {
  const token = searchParams?.token
  const callbackURL = searchParams?.callbackURL || "/"

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold">Email verification</h1>
        <p className="text-sm text-red-600">Missing verification token.</p>
      </main>
    )
  }

  try {
    await auth.api.verifyEmail({
      query: { token, callbackURL },
      headers: await headers(),
    })
  } catch (e) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold">Email verification</h1>
        <p className="text-sm text-red-600">Invalid or expired token.</p>
      </main>
    )
  }

  redirect(callbackURL || "/")
}
