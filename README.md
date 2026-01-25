# Better Auth Demo

A production-ready authentication demonstration project built with [Next.js](https://nextjs.org), [Better Auth](https://www.better-auth.com), [Prisma](https://www.prisma.io), and [SQLite](https://www.sqlite.org).

This project showcases best practices for implementing secure authentication in modern web applications, complete with session management, protected routes, and type-safe database operations.

## 🎯 Quick Links

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Available Pages & Routes](#available-pages--routes)
- [Development](#development)
- [Deployment](#deployment)

## 📋 Project Overview

This project demonstrates a complete authentication system featuring:

- ✅ Email/password authentication with form validation
- ✅ User registration and sign-in flows
- ✅ Session management with secure HTTP-only cookies
- ✅ Server-action sign-out (no extra client fetch)
- ✅ Protected (private) and public route examples
- ✅ Type-safe database operations with Prisma ORM
- ✅ SQLite database (easily migrate to PostgreSQL/MySQL)
- ✅ Modern UI built with Tailwind CSS
- ✅ Full TypeScript support for type safety
- ✅ OAuth-ready architecture for social providers
- ✅ Email verification support (ready to extend)

## 🛠 Tech Stack

| Layer               | Technology                  | Version |
| ------------------- | --------------------------- | ------- |
| **Framework**       | Next.js                     | 16.1.4  |
| **Runtime**         | React                       | 19.2.3  |
| **Authentication**  | Better Auth                 | 1.4.17  |
| **Database**        | SQLite (with Prisma ORM)    | -       |
| **Styling**         | Tailwind CSS                | 4       |
| **Language**        | TypeScript                  | 5       |
| **Package Manager** | pnpm                        | 8+      |
| **Node.js**         | >= 20.19 or 22.12+ or 24.0+ | -       |

## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 20.19 (or v22.12+, v24.0+)
- **pnpm** >= 8.x
- **Git**

> **Note**: SQLite is bundled with this project—no separate database installation needed.

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd better-auth-demo

# Install dependencies
pnpm install
```

### 2️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Better Auth Configuration
BETTER_AUTH_SECRET="<your-generated-secret>"  # Generate: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"       # Your app's base URL
```

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

Copy the output and paste it as `BETTER_AUTH_SECRET`.

### 3️⃣ Initialize Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init
```

This will:

- Create the SQLite database file
- Apply all pending migrations
- Generate type-safe Prisma Client

### 4️⃣ Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📍 Available Pages & Routes

| Page         | URL             | Type      | Description                                              |
| ------------ | --------------- | --------- | -------------------------------------------------------- |
| Home         | `/`             | Protected | Welcome page (redirects to sign-in if not authenticated) |
| Sign In      | `/sign-in`      | Public    | Email/password login form                                |
| Register     | `/register`     | Public    | New user registration form                               |
| Public Page  | `/public-page`  | Public    | Example public page                                      |
| Private Page | `/private-page` | Protected | Example protected page                                   |
| API Routes   | `/api/auth/*`   | API       | Better Auth endpoints                                    |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/[...all]/
│   │       └── route.ts              # Better Auth API handler
│   ├── sign-in/
│   │   └── page.tsx                  # Sign in form
│   ├── register/
│   │   └── page.tsx                  # Registration form
│   ├── private-page/
│   │   └── page.tsx                  # Protected page example
│   ├── public-page/
│   │   └── page.tsx                  # Public page example
│   ├── layout.tsx                    # Root layout component
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── lib/
│   ├── auth.ts                       # Better Auth server config
│   ├── auth-client.ts                # Client-side auth helpers
│   └── prisma.ts                     # Prisma client instance
└── ...

prisma/
├── schema.prisma                     # Database schema definition
├── prisma.config.ts                  # Prisma configuration
└── migrations/                       # Database migration history

public/                               # Static assets
```

## 🗄️ Database Schema

The project includes four main models:

### User

Stores user account information:

```prisma
model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  image     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Session

Manages user sessions with expiration:

```prisma
model Session {
  id        String    @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String    @unique
  createdAt DateTime  @default(now())
}
```

### Account

Stores OAuth provider connections:

```prisma
model Account {
  id       String    @id @default(cuid())
  userId   String
  provider String
  providerAccountId String
}
```

### Verification

Manages email verification tokens:

```prisma
model Verification {
  id       String    @id @default(cuid())
  identifier String
  token    String    @unique
  expires  DateTime
}
```

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema.

## 🔐 Authentication Architecture

Better Auth handles all authentication logic with these key components:

### Server Configuration

Located in [src/lib/auth.ts](src/lib/auth.ts):

- Core Better Auth instance with Prisma adapter
- Email/password authentication enabled
- SQLite provider configuration
- Next.js cookie plugin for session management

### API Endpoints

Generated automatically at `/api/auth/*`:

| Endpoint                  | Method | Purpose                          |
| ------------------------- | ------ | -------------------------------- |
| `/api/auth/sign-up`       | POST   | Register a new user              |
| `/api/auth/sign-in/email` | POST   | Authenticate with email/password |
| `/api/auth/sign-out`      | POST   | Logout user                      |
| `/api/auth/session`       | GET    | Get current session              |

### Client Integration

Use [src/lib/auth-client.ts](src/lib/auth-client.ts) in React components:

```typescript
import { authClient } from "@/lib/auth-client"

export function LoginForm() {
  // Available methods:
  // authClient.signIn()
  // authClient.signUp()
  // authClient.signOut()
  // authClient.useSession() - Hook for session data
}
```

### Server Actions

- Sign out uses a server action at [src/app/actions/sign-out.ts](src/app/actions/sign-out.ts) so the session cookie is cleared server-side without an extra REST call.

Example usage:

```tsx
import { signOutAction } from "@/app/actions/sign-out"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutAction()
    router.replace("/sign-in")
    router.refresh()
  }

  return <button onClick={handleSignOut}>Sign out</button>
}
```

### Session Flow

```
User Submits Form
    ↓
POST /api/auth/sign-in/email
    ↓
Better Auth Validates Credentials
    ↓
Create Session + HTTP-Only Cookie
    ↓
User Redirected to Home
    ↓
Session Retrieved from Cookie on Protected Pages
```

## 🚀 Development

### Available Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Useful Prisma Commands

**View Database with Prisma Studio:**

```bash
pnpm prisma studio
```

Opens [http://localhost:5555](http://localhost:5555) with a visual database editor.

**Create a New Migration:**

```bash
pnpm prisma migrate dev --name <description>
```

Example: `pnpm prisma migrate dev --name add_user_phone_field`

**Sync Schema to Database (without migrations):**

```bash
pnpm prisma db push
```

Use for rapid prototyping only—production requires migrations.

**Reset Database (Development Only):**

```bash
pnpm prisma migrate reset
```

⚠️ **Warning**: Deletes all data and resets migration history.

**Regenerate Prisma Client:**

```bash
pnpm prisma generate
```

Run after manual schema edits or if types become out of sync.

**Pull Existing Database Schema:**

```bash
pnpm prisma db pull
```

Use if you have an existing database to auto-generate schema.

### Extending Authentication

To add OAuth providers (GitHub, Google, etc.):

1. Update [src/lib/auth.ts](src/lib/auth.ts):

   ```typescript
   export const auth = betterAuth({
     // ... existing config
     socialProviders: {
       github: {
         clientId: process.env.GITHUB_CLIENT_ID as string,
         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
       },
       google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
       },
     },
   })
   ```

2. Add environment variables to `.env.local`:

   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

3. Reference [Better Auth OAuth Documentation](https://www.better-auth.com/docs/integrations/social-providers) for provider-specific setup.

### Debugging

**View Session Data:**

```typescript
// In a Server Component
const session = await auth.api.getSession({ headers: await headers() })
console.log("Session:", session)
```

**Check API Responses:**
Open browser DevTools → Network tab → Monitor `/api/auth/*` requests

**Database Issues:**

```bash
# Check migration status
pnpm prisma migrate status

# View logs
pnpm prisma generate --verbose
```

## 🚢 Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Platform-Specific Guides

#### **Vercel (Recommended for Next.js)**

1. Push code to GitHub/GitLab
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   ```
   DATABASE_URL=your_production_database
   BETTER_AUTH_SECRET=your_production_secret
   BETTER_AUTH_URL=https://yourdomain.com
   ```
4. Deploy automatically on push

#### **Railway, Fly.io, or Self-Hosted**

1. Build application: `pnpm build`
2. Ensure production database is running (PostgreSQL/MySQL recommended)
3. Run migrations: `pnpm prisma migrate deploy`
4. Start server: `pnpm start`

### Database Migration for Production

**SQLite works for small projects.** For larger applications, migrate to PostgreSQL or MySQL:

1. Update `prisma/schema.prisma` datasource:

   ```prisma
   datasource db {
     provider = "postgresql"  // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Set `DATABASE_URL` to your production database:

   ```
   postgresql://user:password@host:5432/dbname
   ```

3. Create and apply migration:
   ```bash
   pnpm prisma migrate dev --name switch_to_postgresql
   ```

### Security Checklist

- [ ] Generate strong `BETTER_AUTH_SECRET` (32+ characters)
- [ ] Set `BETTER_AUTH_URL` to your production domain
- [ ] Use HTTPS in production
- [ ] Enable CORS if using separate frontend domain
- [ ] Keep dependencies updated: `pnpm update`
- [ ] Monitor for security vulnerabilities: `pnpm audit`
- [ ] Configure firewall/network policies for database access
- [ ] Use managed database services (AWS RDS, Railway, etc.)
- [ ] Enable database backups
- [ ] Implement rate limiting on auth endpoints
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

## 📚 Learning Resources

**Better Auth:**

- [Official Documentation](https://www.better-auth.com/docs)
- [Installation Guide](https://www.better-auth.com/docs/installation)
- [Basic Usage](https://www.better-auth.com/docs/basic-usage)
- [API Reference](https://www.better-auth.com/docs/api-reference)

**Next.js:**

- [Next.js Documentation](https://nextjs.org/docs)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

**Prisma:**

- [Prisma Documentation](https://www.prisma.io/docs)
- [SQLite Guide](https://www.prisma.io/docs/orm/overview/databases/sqlite)
- [Migrate Documentation](https://www.prisma.io/docs/orm/prisma-migrate)
- [Query Documentation](https://www.prisma.io/docs/orm/prisma-client)

**Styling:**

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💡 Common Issues & Solutions

### Database Connection Error

**Problem**: `Could not connect to database`
**Solution**:

```bash
# Check DATABASE_URL in .env.local
# Recreate database:
rm prisma/dev.db
pnpm prisma migrate dev --name init
```

### Session Not Persisting

**Problem**: User logged out after page refresh
**Solution**: Check that cookies are enabled and `BETTER_AUTH_URL` matches your app URL in `.env.local`

### TypeScript Errors in Generated Types

**Problem**: `Type 'X' is not assignable to type 'Y'`
**Solution**: Regenerate Prisma types:

```bash
pnpm prisma generate
```

### Migration Conflicts

**Problem**: `The migration you are trying to resolve already exists`
**Solution**:

```bash
pnpm prisma migrate resolve --rolled-back 20250125024529_init
```

### Port 3000 Already in Use

**Solution**:

```bash
pnpm dev -- -p 3001  # Use different port
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

---

## ToDo:

- Add Google strategy to the auth configuration
- Add email verification flow
- Add password reset flow
- Add Two-Factor Authentication (2FA) example
- Add Passkey authentication example
