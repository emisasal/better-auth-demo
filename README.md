# Better Auth Demo

A modern authentication demonstration project built with [Next.js](https://nextjs.org), [Better Auth](https://www.better-auth.com), [Prisma](https://www.prisma.io), and [SQLite](https://www.sqlite.org).

## Project Overview

This project showcases a complete authentication system with:

- User registration and email/password authentication
- Session management
- Protected and public routes
- User profile management
- Email verification support
- Built-in database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Authentication**: Better Auth
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.19 (or v22.12+, v24.0+)
- **pnpm** >= 8.x (or npm/yarn as alternatives)
- **Git**

SQLite is bundled with this project, so no additional database setup is required.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd better-auth-demo
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

   This installs all required packages including:
   - `prisma` - Prisma CLI for database management
   - `@prisma/client` - Type-safe database query client
   - `@prisma/adapter-better-sqlite3` - SQLite adapter for Prisma
   - `better-sqlite3` - High-performance SQLite driver
   - `dotenv` - Environment variable loader

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database - SQLite uses a local file
   DATABASE_URL="file:./prisma/dev.db"

   # Better Auth Configuration
   BETTER_AUTH_SECRET="<generate-a-32-character-secret>" # Use openssl rand -base64 32
   BETTER_AUTH_URL="http://localhost:3000"                # Your app's base URL
   ```

   **Generating BETTER_AUTH_SECRET**:

   ```bash
   openssl rand -base64 32
   ```

   The secret should be at least 32 characters and generated with high entropy for security.

4. **Generate Prisma Client**:

   ```bash
   pnpm dlx prisma generate
   ```

   This generates the type-safe Prisma Client based on your schema.

5. **Initialize the database**:

   ```bash
   pnpm dlx prisma migrate dev --name init
   ```

   This command will:
   - Create the SQLite database file at `prisma/dev.db`
   - Run all pending migrations
   - Generate the Prisma Client for type-safe queries

   If migrations have already been applied, you can sync your database schema with:

   ```bash
   pnpm dlx prisma db push
   ```

## Available Scripts

- `pnpm dev` - Start the development server (http://localhost:3000)
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...all]/     # Authentication API routes
│   ├── sign-in/               # Sign in page
│   ├── register/              # Registration page
│   ├── private-page/          # Protected page example
│   ├── public-page/           # Public page example
│   └── layout.tsx             # Root layout
├── lib/
│   ├── auth.ts               # Better Auth configuration
│   ├── auth-client.ts        # Client-side auth helpers
│   └── prisma.ts             # Prisma client instance
└── globals.css               # Global styles

prisma/
├── schema.prisma             # Database schema
└── migrations/               # Database migrations
```

## Database Schema

The project includes the following models:

- **User**: Stores user information (name, email, image, etc.)
- **Session**: Manages user sessions with expiration and metadata
- **Account**: OAuth provider accounts linked to users
- **Verification**: Email verification tokens and purposes

## Getting Started

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Navigate to the sign-up page to create a new account

4. After authentication, you can access protected pages

## Key Features

- ✅ Email and password authentication with validation
- ✅ Session management with secure cookies
- ✅ Protected and public routes
- ✅ User registration and sign-in flows
- ✅ Email verification support
- ✅ OAuth-ready architecture (extensible to social providers)
- ✅ SQLite database with Prisma ORM
- ✅ Type-safe authentication with TypeScript
- ✅ Modern UI with Tailwind CSS

## Authentication Architecture

This project uses **Better Auth** for authentication management with the following components:

- **Server-side Auth** (`src/lib/auth.ts`): Core authentication instance configured with Prisma adapter
- **API Routes** (`src/app/api/auth/[...all]/route.ts`): Next.js handler for authentication endpoints
- **Client-side Auth** (`src/lib/auth-client.ts`): React client for authentication operations
- **Database Layer**: Prisma ORM with SQLite storing users, sessions, and account data

### How Authentication Works

1. **User Registration/Sign-in**: Form submits to `/api/auth/*` endpoints
2. **Better Auth Processing**: Validates credentials and manages sessions
3. **Session Storage**: Secure HTTP-only cookies store session data
4. **Protected Routes**: Client checks session status before rendering protected pages
5. **Type Safety**: TypeScript ensures type-safe auth operations throughout the app

### Extending Authentication

To add new authentication methods (e.g., OAuth providers):

1. Update `src/lib/auth.ts` with new configuration:

   ```typescript
   export const auth = betterAuth({
     // ... existing config
     socialProviders: {
       github: {
         clientId: process.env.GITHUB_CLIENT_ID as string,
         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
       },
     },
   })
   ```

2. Add environment variables for your provider
3. Update `.env.local` with provider credentials

## Development Tips

### Understanding Better Auth Flow

1. **Generate Secret**:

   ```bash
   openssl rand -base64 32
   ```

   Add this to `BETTER_AUTH_SECRET` in `.env.local`

2. **API Endpoints**: Better Auth creates endpoints at `/api/auth/*`:
   - `POST /api/auth/sign-up` - Register new users
   - `POST /api/auth/sign-in` - Authenticate users
   - `POST /api/auth/sign-out` - Logout users
   - `GET /api/auth/session` - Get current session

3. **Client Integration**: Use the auth client in React components:

   ```typescript
   import { authClient } from "@/lib/auth-client"

   export function LoginForm() {
     const { signIn } = authClient
     // Use signIn, signUp, useSession, etc.
   }
   ```

### Prisma Studio

View and manage your database records with a visual editor:

```bash
pnpm dlx prisma studio --config ./prisma.config.ts
```

This opens a web interface at `http://localhost:5555` where you can:

- Browse all database tables and records
- Create, update, and delete records
- View relationships between tables

### Database Migrations

When you modify `prisma/schema.prisma`, create and apply a new migration:

```bash
pnpm dlx prisma migrate dev --name <descriptive-name>
```

This will:

- Create a new SQL migration file in `prisma/migrations/`
- Apply the migration to your development database
- Regenerate the Prisma Client types

Example:

```bash
pnpm dlx prisma migrate dev --name add_user_role_field
```

### Introspect Database

If you have an existing database schema, regenerate your Prisma schema:

```bash
pnpm dlx prisma db pull
```

This reads your database and updates `prisma/schema.prisma` accordingly.

### Sync Database Schema

Push schema changes directly to the database (without migrations):

```bash
pnpm dlx prisma db push
```

Use this for rapid prototyping. For production, always use migrations.

### Reset Database

⚠️ **Warning**: This deletes all data and resets migrations (use only in development):

```bash
pnpm dlx prisma migrate reset
```

This will:

- Drop the database
- Create a new database
- Apply all migrations from scratch

### Generate Prisma Client

Regenerate types after manual schema changes:

```bash
pnpm dlx prisma generate
```

## Deployment

To deploy this application:

1. Build the application:

   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

For production deployment, consider:

- **Database**: SQLite works well for small-to-medium applications. For larger apps, migrate to PostgreSQL or MySQL by updating `prisma/schema.prisma` and `DATABASE_URL` in your environment variables
- **Environment Variables**: Set `DATABASE_URL` to your production database connection string
- **Prisma Migrations**: Run `pnpm dlx prisma migrate deploy` in production to apply pending migrations
- **CORS & Security**: Configure CORS headers and security policies for your domain
- **Hosting**: Deploy to Vercel (Next.js optimized), Railway, Fly.io, or your preferred platform

## Understanding the Database Setup

This project uses Prisma as an ORM with SQLite:

- **Prisma Configuration**: Located in `prisma.config.ts` and `prisma/schema.prisma`
- **Database File**: SQLite stores data in `prisma/dev.db` (generated after first migration)
- **Migrations**: Track schema changes in `prisma/migrations/`
- **Type Safety**: Prisma generates TypeScript types from your schema automatically
- **Adapter**: Uses `@prisma/adapter-better-sqlite3` for high-performance SQLite queries

For detailed information, see the [Prisma SQLite guide](https://www.prisma.io/docs/orm/overview/databases/sqlite).

## Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Installation Guide](https://www.better-auth.com/docs/installation)
- [Better Auth Basic Usage](https://www.better-auth.com/docs/basic-usage)
- [Better Auth API Reference](https://www.better-auth.com/docs/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [Prisma SQLite Guide](https://www.prisma.io/docs/orm/overview/databases/sqlite)
- [Prisma Migrate Documentation](https://www.prisma.io/docs/orm/prisma-migrate)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
