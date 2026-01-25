"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function signUpAction(input: {
  name: string
  email: string
  password: string
}) {
  const { name, email, password } = input
  // Perform server-side sign-up using Better Auth
  await auth.api.signUpEmail({
    body: { name, email, password },
    headers: await headers(),
  })
  return { success: true }
}
