"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function signInAction(input: { email: string; password: string }) {
  const { email, password } = input
  // Perform server-side sign-in using Better Auth
  await auth.api.signInEmail({
    body: { email, password },
    headers: await headers(),
  })
  return { success: true }
}
