"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function sendVerificationEmailAction(input: {
  email: string
  callbackURL?: string
}) {
  const { email, callbackURL } = input
  await auth.api.sendVerificationEmail({
    body: { email, callbackURL },
    headers: await headers(),
  })
  return { success: true }
}
