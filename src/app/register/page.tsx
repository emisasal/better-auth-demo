"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUpAction } from "@/app/actions/sign-up"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    // Validation
    if (!name.trim()) {
      setError("Name is required")
      // no-op
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      // no-op
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      // no-op
      return
    }

    startTransition(async () => {
      try {
        await signUpAction({ email, password, name })
        router.push("/")
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-2 text-2xl font-semibold">Create an account</h1>
      <p className="mb-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Full Name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="John Doe"
            autoComplete="name"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-500">At least 8 characters</p>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </main>
  )
}
