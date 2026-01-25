"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { signOutAction } from "@/app/actions/sign-out"

export function SignOutButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = () => {
    setError(null)

    startTransition(async () => {
      try {
        await signOutAction()
        router.replace("/sign-in")
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        {pending ? "Signing out..." : "Sign out"}
      </button>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
