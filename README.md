# 🎓 LearnHub

> **AI-Powered Online Learning Platform (LMS)** — A modern, production-ready learning management system built with Next.js 16, TypeScript, and PostgreSQL.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.1-black?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**LearnHub** is a comprehensive Learning Management System (LMS) designed to deliver exceptional online learning experiences. Built on the cutting-edge Next.js 16 App Router with React 19, it combines powerful AI capabilities with an intuitive user interface.

The platform supports a **multi-role architecture** (Students, Instructors, and Administrators), enabling seamless course creation, enrollment, progress tracking, and AI-powered learning assistance.

---

## ✨ Features

### 👨‍🎓 For Students

| Feature                    | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| 📚 **Course Discovery**    | Browse, search, and filter courses by category, difficulty level, and price |
| ▶️ **Interactive Lessons** | Seamless lesson player with video integration and intuitive navigation      |
| 📊 **Progress Tracking**   | Real-time tracking of completed lessons with visual progress indicators     |
| 🤖 **AI Study Assistant**  | Get simplified explanations and analogies for complex technical concepts    |
| 🌓 **Dark Mode**           | Optimized for late-night study sessions with system theme detection         |
| 📱 **Responsive Design**   | Mobile-first UI that works flawlessly across all devices                    |

### 👨‍🏫 For Instructors

| Feature                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| 🛠️ **Course Builder**      | Create and organize courses with structured chapters and lessons     |
| 📝 **Content Management**  | Manage video URLs, descriptions, and rich-text lesson content        |
| ✅ **Publishing Workflow** | Validation-based flow ensuring course completeness before publishing |
| 📈 **Analytics Dashboard** | Track student enrollment, engagement, and completion rates           |

### 🛡️ Platform Features

| Feature                  | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| 🔐 **Authentication**    | Secure auth via Google OAuth and email/password credentials (NextAuth.js) |
| 🎭 **Role-Based Access** | Secure dashboards tailored for each user persona                          |
| 🚀 **Performance**       | Server Components, Server Actions, and React Compiler for optimal speed   |
| ♿ **Accessibility**     | WCAG-compliant components with keyboard navigation support                |
| 🌐 **SEO Optimized**     | Metadata API integration for improved search engine visibility            |

---

## 🛠️ Tech Stack

### Frontend

| Technology                                                    | Version | Purpose                           |
| ------------------------------------------------------------- | ------- | --------------------------------- |
| [**Next.js**](https://nextjs.org)                             | 16.2.1  | React framework with App Router   |
| [**React**](https://react.dev)                                | 19.2.4  | UI library with Server Components |
| [**TypeScript**](https://www.typescriptlang.org)              | 5.x     | Type-safe development             |
| [**Tailwind CSS**](https://tailwindcss.com)                   | 4.x     | Utility-first styling             |
| [**shadcn/ui**](https://ui.shadcn.com)                        | Latest  | Accessible component library      |
| [**Radix UI**](https://www.radix-ui.com)                      | 1.4.3   | Unstyled accessible primitives    |
| [**Lucide React**](https://lucide.dev)                        | 1.7.0   | Beautiful icon library            |
| [**next-themes**](https://github.com/pacocoursey/next-themes) | 0.4.6   | Theme switching (dark/light)      |

### Backend & Database

| Technology                                   | Version | Purpose              |
| -------------------------------------------- | ------- | -------------------- |
| [**Prisma**](https://www.prisma.io)          | 7.5.0   | Next-generation ORM  |
| [**PostgreSQL**](https://www.postgresql.org) | Latest  | Relational database  |
| [**NextAuth.js**](https://authjs.dev)        | 4.24.x  | Authentication layer |

### AI & State Management

| Technology                                  | Version | Purpose                            |
| ------------------------------------------- | ------- | ---------------------------------- |
| [**Vercel AI SDK**](https://sdk.vercel.ai)  | Latest  | AI/LLM integration                 |
| [**Zustand**](https://zustand-demo.pmnd.rs) | 5.0.12  | Lightweight state management       |
| [**Zod**](https://zod.dev)                  | 4.3.6   | TypeScript-first schema validation |

### DevTools

| Technology                                                         | Version | Purpose                  |
| ------------------------------------------------------------------ | ------- | ------------------------ |
| [**ESLint**](https://eslint.org)                                   | 9.x     | Code quality and linting |
| [**Babel React Compiler**](https://react.dev/learn/react-compiler) | 1.0.0   | Automatic memoization    |
| [**tsx**](https://tsx.is)                                          | Latest  | TypeScript execution     |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Students  │  │ Instructors │  │   Administrators    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          └────────────────┴────────────────────┘
                           │
          ┌────────────────▼────────────────┐
          │         Next.js 16 App          │
          │  ┌─────────────────────────┐    │
          │  │   App Router (RSC)      │    │
          │  │   Server Components     │    │
          │  │   Server Actions        │    │
          │  └─────────────────────────┘    │
          │  ┌─────────────────────────┐    │
          │  │      NextAuth.js        │    │
          │  │   (Authentication)      │    │
          │  └─────────────────────────┘    │
          └────────────────┬────────────────┘
                           │
          ┌────────────────▼────────────────┐
          │           Prisma ORM            │
          └────────────────┬────────────────┘
                           │
          ┌────────────────▼────────────────┐
          │        PostgreSQL Database      │
          │  ┌─────┐ ┌──────┐ ┌──────────┐  │
          │  │User │ │Course│ │ Progress │  │
          │  └─────┘ └──────┘ └──────────┘  │
          └─────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [**Node.js**](https://nodejs.org) 20.x or later or use recommended one 24.14.1
- [**npm**](https://www.npmjs.com), [**yarn**](https://yarnpkg.com), or [**pnpm**](https://pnpm.io)
- [**PostgreSQL**](https://www.postgresql.org/download/) 14+ or [**Prisma Postgres**](https://www.prisma.io/docs/getting-started/quickstart-prismaPostgres)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/zaid-khan-code/learnHub-ai-powered-online-learning-platform-lms.git
   cd learnhub
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/learnhub"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
learnhub/
├── prisma/
│   ├── schema.prisma          # Database schema & models
│   ├── migrations/            # Database migrations
│   └── seeds/                 # Database seeders
├── public/                    # Static assets
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Authentication routes
│   │   ├── (dashboard)/      # Dashboard routes
│   │   ├── api/              # API endpoints
│   │   ├── courses/          # Course pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── course/           # Course-related components
│   │   ├── auth/             # Authentication components
│   │   └── shared/           # Shared components
│   ├── lib/
│   │   ├── auth.ts           # Auth configuration
│   │   ├── db.ts             # Database client
│   │   ├── utils.ts          # Utility functions
│   │   └── validations/      # Zod schemas
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript type definitions
├── .env                       # Environment variables
├── .env.example              # Example environment variables
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies & scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── eslint.config.mjs         # ESLint configuration
```

---

## 🗄️ Database Schema

The application uses a relational PostgreSQL database with the following core models:

```prisma
// Core Models Overview

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(STUDENT)
  courses       Course[]
  progress      Progress[]
  // ... timestamps
}

model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  slug        String   @unique
  price       Decimal?
  published   Boolean  @default(false)
  instructorId String
  chapters    Chapter[]
  // ... timestamps
}

model Chapter {
  id          String   @id @default(cuid())
  title       String
  description String?
  position    Int
  videoUrl    String?
  courseId    String
  course      Course   @relation(...)
  progress    Progress[]
  // ... timestamps
}

model Progress {
  id        String   @id @default(cuid())
  userId    String
  chapterId String
  completed Boolean  @default(false)
  user      User     @relation(...)
  chapter   Chapter  @relation(...)
  // ... timestamps
}
```

> 📌 **Note:** Run `npx prisma studio` to explore and manage your database visually.

---

## 🧪 Development

### Available Scripts

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `npm run dev`            | Start development server (http://localhost:3000) |
| `npm run build`          | Build for production                             |
| `npm run start`          | Start production server                          |
| `npm run lint`           | Run ESLint                                       |
| `npx prisma generate`    | Generate Prisma Client                           |
| `npx prisma migrate dev` | Create and apply migration                       |
| `npx prisma studio`      | Open Prisma Studio (database GUI)                |
| `npx prisma db push`     | Push schema to database (dev only)               |

### Code Style

This project follows strict TypeScript and ESLint configurations:

- **Strict mode** enabled for maximum type safety
- **Prettier** for consistent formatting
- **eslint-config-next** for Next.js best practices

---

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [**Vercel**](https://vercel.com):

1. Push your code to a Git repository
2. Import your project in Vercel
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/learnhub)

### Environment Variables for Production

Ensure these are set in your hosting platform:

```env
DATABASE_URL=           # Production PostgreSQL connection string
NEXTAUTH_SECRET=        # Random secret for session encryption
NEXTAUTH_URL=           # Production domain URL
GOOGLE_CLIENT_ID=       # Google OAuth credentials (if using)
GOOGLE_CLIENT_SECRET=   # Google OAuth credentials (if using)
```

### Self-Hosting

For self-hosting, build the application first:

```bash
npm run build
npm run start
```

Or use Docker:

```bash
docker build -t learnhub .
docker run -p 3000:3000 --env-file .env learnhub
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before requesting review

---

## 📄 License

This project is licensed under the [**MIT License**](LICENSE).

---

## 🙏 Acknowledgments

- [**Next.js**](https://nextjs.org) — The React Framework
- [**Vercel**](https://vercel.com) — Deployment platform
- [**shadcn/ui**](https://ui.shadcn.com) — Beautiful UI components
- [**Prisma**](https://www.prisma.io) — Developer-friendly ORM
- [**Tailwind CSS**](https://tailwindcss.com) — Utility-first CSS framework

---
