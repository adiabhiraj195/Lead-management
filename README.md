# LeadTrack — Full-Stack Lead Management System

A modern, full-stack CRM lead management platform designed to track, organize, and transition sales prospects through each lifecycle stage. Built with a decoupled architecture featuring a **Next.js 16** frontend and an **Express 5 + Prisma + PostgreSQL** backend.

## Check Out : https://client-rosy-alpha-47.vercel.app/


## Overview

### Key Features
- **Server-Side Pagination & Multi-Field Search**: Fast search matching across full names, emails, and phone numbers with configurable page sizes (10, 25, 50, 100).
- **Quick Status Transitions**: Modal-based lifecycle progression with instant UI feedback.
- **End-to-End Type Safety**: Shared validation rules powered by Zod schemas across client and server.
- **Optimistic UI & Cache Management**: Zero-latency feel via TanStack React Query cache invalidation.
- **Dark & Light Mode Support**: Styled with Tailwind CSS v4.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Client State & API** | [TanStack React Query v5](https://tanstack.com/query), [Axios](https://axios-http.com/), [Zod](https://zod.dev/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express v5](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), `tsx` |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM v7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Validation & Handling**| [Zod v4](https://zod.dev/), Centralized Error Middleware, CORS |

---

## Architecture

I followed the MVC architecture with **Global Error Handling**. Utilising Middlewares chain and Custom Error class


### Repository Structure

```text
lead-management/
├── client/                     # Next.js 16 frontend application
│   ├── app/                    # App router (page.tsx, layout.tsx, globals.css)
│   ├── components/             # Reusable UI components
│   │   ├── create-lead-modal.tsx
│   │   ├── lead-search-bar.tsx
│   │   ├── lead-stats.tsx
│   │   ├── lead-status-badge.tsx
│   │   ├── lead-table.tsx
│   │   ├── pagination-controls.tsx
│   │   ├── ui-toast.tsx
│   │   └── update-status-modal.tsx
│   ├── hooks/                  # TanStack Query custom hooks (use-leads.ts)
│   ├── lib/                    # API client, types, Zod validations, Query provider
│   │   ├── api-client.ts       # Axios instance with centralized error handling
│   │   ├── query-provider.tsx  # TanStack Query Client provider wrapper
│   │   ├── types.ts            # Frontend domain TypeScript interfaces
│   │   └── validations.ts      # Client-side form & query validation schemas
│   ├── .env.local              # Client environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── server/                     # Express 5 + Prisma backend application
│   ├── prisma/                 # Database schema, migrations, and seed scripts
│   │   ├── migrations/         # PostgreSQL DDL migrations
│   │   ├── schema.prisma       # Prisma schema (Lead model & LeadStatus enum)
│   │   └── seed.ts             # 100 realistic dummy leads seeder
│   ├── src/
│   │   ├── config/             # Environment configuration (env.ts)
│   │   ├── controllers/        # Request handlers (lead.controller.ts, health.controller.ts)
│   │   ├── lib/                # Shared singletons (prisma.ts)
│   │   ├── middleware/         # Validation & centralized error handlers
│   │   ├── routes/             # Express API routes (lead.route.ts, health.route.ts)
│   │   ├── schemas/            # Zod validation schemas for body, query, and params
│   │   ├── services/           # Business logic & Prisma database interactions
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # Server entry point & listener
│   ├── .env.example            # Backend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── API_DOCUMENTATION.md        # Comprehensive REST API documentation
└── README.md                   # Project documentation
```

### Request-Response Lifecycle

1. **Client Action**: User submits a form or triggers search/pagination.
2. **Client Validation**: Zod parses input before network dispatch. Invalid inputs show immediate inline errors.
3. **Transport**: Axios sends an HTTP request with JSON payload or query parameters.
4. **Server Middleware**: Express applies CORS, extracts JSON bodies, and runs `validateRequest` middleware matching the route's Zod schema.
5. **Controller & Service**: The controller calls the service layer, which constructs parameterized Prisma queries.
6. **Error Handling**: Any failure (e.g. database duplicate email constraint `P2002`, invalid UUID, or schema mismatch) is captured by `errorHandler.ts`, returning a uniform error object:
   ```json
   {
     "success": false,
     "error": {
       "message": "A lead with this email already exists",
       "status": 409
     }
   }
   ```
7. **Cache Sync**: On mutation success (`POST` / `PATCH`), TanStack Query invalidates `["leads"]`, triggering an automatic background re-fetch and UI update.

---

## Setup Instructions

### Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm**: v9.x+ (or `pnpm` / `yarn`)
- **PostgreSQL**: Local instance running on port 5432 (or a hosted PostgreSQL connection string from Neon / Supabase / Railway)

---

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/lead-management.git
cd lead-management
```

---

### 2. Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to supply your PostgreSQL credentials:
   ```env
   PORT=8000
   NODE_ENV=development
   CORS_ORIGIN=*
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lead_management?schema=public"
   ```

4. **Run Database Migrations & Generate Prisma Client**:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

5. **(Optional) Seed Database with 100 Sample Leads**:
   ```bash
   npm run db:seed
   ```

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The backend will start at **`http://localhost:8000`**. Verify via health check:
   ```bash
   curl http://localhost:8000/health
   ```

#### Backend NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts server with live reload via `tsx watch` |
| `npm run build` | Generates Prisma client & compiles TypeScript to `dist/` |
| `npm run start` | Executes compiled server via `tsx src/index.ts` |
| `npm run db:migrate` | Runs Prisma migrations in development mode |
| `npm run db:generate`| Regenerates Prisma client types |
| `npm run db:studio` | Opens Prisma Studio web UI for database inspection |
| `npm run db:seed` | Seeds 100 diverse dummy leads with staggered timestamps |

---

### 3. Frontend Setup

1. **Open a new terminal and navigate to `client/`**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create or verify `.env.local`:
   ```bash
   cp .env.example .env.local 2>/dev/null || :
   ```
   Ensure `.env.local` points to your backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at **`http://localhost:3000`**.

#### Frontend NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches Next.js dev server on port 3000 |
| `npm run build` | Builds production Next.js application |
| `npm run start` | Starts Next.js production server |
| `npm run lint` | Runs ESLint checks |

---

## Trade-offs

| Decision | Chosen Approach | Alternative Considered | Rationale & Trade-off |
| :--- | :--- | :--- | :--- |
| **Project Structure** | **Decoupled Folders (`client/` & `server/`)** | Turborepo / Nx Monorepo | Keeps the project lightweight, portable, and free of monorepo tooling overhead. **Trade-off**: Requires separate `npm install` and terminal processes during local development. |
| **Pagination Strategy** | **Offset-based (`skip` & `take`)** | Keyset / Cursor-based Pagination | Offset pagination enables arbitrary jumping to specific pages (e.g. Page 5) and displays total page count. **Trade-off**: High offset values (`OFFSET 100000`) can degrade performance on very large tables compared to cursor pagination. |
| **Search Implementation** | **Prisma `contains` (ILIKE) on `name`, `email`, `phone`** | PostgreSQL `tsvector` / Elasticsearch | Zero external dependencies; operates natively within PostgreSQL using Prisma's cross-platform query API. **Trade-off**: Full-table scan overhead on extremely large datasets where inverted search indices or Meilisearch would be faster. |
| **Data Fetching Layer** | **Client Components with TanStack Query + Axios** | React Server Components (RSC) + Server Actions | Provides superior real-time interactivity, instant client-side debounced search, optimistic updates, and background cache invalidation. **Trade-off**: Requires CORS configuration and an initial client JS bundle download. |
| **Status Filtering** | **Hybrid (Server-side text search + Client-side status view)** | Pure server-side combined query params | Instantaneous client tab switching between statuses for the active result set without issuing extra network requests. **Trade-off**: Status counts are evaluated on the current page partition rather than across the entire table unless queried without pagination. |

---

## Future Improvements

1. **Advanced Server-Side Filtering & Sorting**:
   - Add query parameters to `GET /api/leads` for `status`, `sortBy` (`createdAt`, `name`, `status`), and `order` (`asc` / `desc`).
2. **Authentication & Role-Based Access Control (RBAC)**:
   - Integrate authentication (e.g., Clerk, NextAuth/Auth.js, or JWT) with distinct roles: Sales Rep (create, edit own leads) vs Sales Manager (full access, delete, export).
3. **CSV / Excel Import & Export**:
   - Bulk upload of leads with CSV format validation and one-click data export for reporting.
4. **Rate Limiting & Production Hardening**:
   - Implement redis rate-limit to prevent brute-force submissions.
   - Add security headers via `helmet`.
---

### Quick Summary of Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check and uptime status |
| `GET` | `/api/leads` | Retrieve paginated leads with optional `search`, `page`, and `limit` |
| `POST` | `/api/leads` | Create a new lead (requires `name`, `email`, `phone`) |
| `PATCH`| `/api/leads/:id/status` | Update a lead's status (`NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`) |

---

## Documentation

- [API Documentation](file:///Users/adityaraj/Documents/SideProject/lead-management/API_DOCUMENTATION.md) — Endpoint specifications, payload examples, and error schemas.
- [AI Engineering Report (AGENT.md)](file:///Users/adityaraj/Documents/SideProject/lead-management/AGENT.md) — Documentation of AI tools, prompts, generated vs. manual sections, and architectural decisions.

---

## License

This project is licensed under the [ISC License](file:///Users/adityaraj/Documents/SideProject/lead-management/server/package.json).