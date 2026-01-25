import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "mysql", "postgresql", ...etc
  }),
  plugins: [nextCookies()],
  advanced: { cookiePrefix: "app_name" }, // To change the default cookie names

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    async sendVerificationEmail({ user, url, token }) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: user.email,
          subject: "Verify your email address",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h1>Email Verification</h1>
              <p>Hi ${user.name || "there"},</p>
              <p>Please verify your email address by clicking the link below:</p>
              <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Verify Email
              </a>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                This link expires in 1 hour.
              </p>
              <p style="color: #666; font-size: 12px;">
                If you didn't sign up for this account, you can safely ignore this email.
              </p>
            </div>
          `,
        })
      } catch (error) {
        console.error("[Better Auth] Failed to send verification email:", error)
        // Fallback to console logging
        console.log("[Better Auth] Verification email fallback:", {
          to: user.email,
          url,
          token,
        })
      }
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    expiresIn: 60 * 60, // 1 hour
    autoSignInAfterVerification: true,
  },
})
