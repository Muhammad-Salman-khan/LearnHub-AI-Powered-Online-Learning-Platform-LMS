# 🎓 LearnHub

> **AI-Powered Online Learning Platform (LMS)** — A modern, production-ready learning management system built with Next.js 16, TypeScript, and PostgreSQL.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-black?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [Deployment](#-deployment)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**LearnHub** is a comprehensive Learning Management System (LMS) designed to deliver exceptional online learning experiences. Built on the cutting-edge **Next.js 16 App Router** with **React 19**, it combines powerful AI capabilities with an intuitive user interface.

The platform supports a **multi-role architecture** (Students, Instructors, and Administrators), enabling seamless course creation, enrollment, progress tracking, and AI-powered learning assistance.

---

## ✨ Features

### 👨‍🎓 For Students

| Feature | Description |
|---------|-------------|
| 📚 **Course Discovery** | Browse and explore available courses by category, difficulty level, and price |
| ▶️ **Lesson Player** | Clean lesson interface with video integration and content display |
| 📊 **Progress Tracking** | Track completed lessons with visual progress indicators |
| 🌓 **Dark Mode** | Optimized for late-night study sessions with system theme detection |
| 📱 **Responsive Design** | Mobile-first UI that works flawlessly across all devices |

### 👨‍🏫 For Instructors

| Feature | Description |
|---------|-------------|
| 🛠️ **Course Builder** | Create and organize courses with structured chapters |
| 📝 **Content Management** | Manage video URLs, descriptions, and lesson content |
| ✅ **Publishing Workflow** | Validation-based flow ensuring course completeness before publishing |
| 📈 **Course Dashboard** | Manage and edit existing courses |

### 🛡️ Platform Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure auth via Google OAuth and email/password credentials (NextAuth.js) |
| 🎭 **Role-Based Access** | Secure dashboards tailored for each user role (Student, Instructor, Admin) |
| 🚀 **Performance** | Server Components, Server Actions, and React Compiler for optimal speed |
| ♿ **Accessibility** | WCAG-compliant components with keyboard navigation support |
| 🌐 **SEO Optimized** | Metadata API integration for improved search engine visibility |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [**Next.js**](https://nextjs.org) | 16.2.1 | React framework with App Router |
| [**React**](https://react.dev) | 19.2.4 | UI library with Server Components |
| [**TypeScript**](https://www.typescriptlang.org) | 5.x | Type-safe development |
| [**Tailwind CSS**](https://tailwindcss.com) | 4.x | Utility-first styling |
| [**shadcn/ui**](https://ui.shadcn.com) | Latest | Accessible component library |
| [**Radix UI**](https://www.radix-ui.com) | 1.4.3 | Unstyled accessible primitives |
| [**Lucide React**](https://lucide.dev) | 1.7.0 | Beautiful icon library |
| [**next-themes**](https://github.com/pacocoursey/next-themes) | 0.4.6 | Theme switching (dark/light) |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| [**Prisma**](https://www.prisma.io) | 7.6.0 | Next-generation ORM |
| [**PostgreSQL**](https://www.postgresql.org) | Latest | Relational database |
| [**@prisma/adapter-pg**](https://www.prisma.io) | 7.6.0 | Prisma PostgreSQL adapter |

### AI & State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| [**Vercel AI SDK**](https://sdk.vercel.ai) | Latest | AI/LLM integration |
| [**Zustand**](https://zustand-demo.pmnd.rs) | 5.0.12 | Lightweight state management |
| [**Zod**](https://zod.dev) | 4.3.6 | TypeScript-first schema validation |

### DevTools

| Technology | Version | Purpose |
|------------|---------|---------|
| [**ESLint**](https://eslint.org) | 10.1.0 | Code quality and linting |
| [**Babel React Compiler**](https://react.dev/learn/react-compiler) | 1.0.0 | Automatic memoization |
| [**tsx**](https://tsx.is) | Latest | TypeScript execution |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [**Node.js**](https://nodejs.org) 20.x or later (recommended: 24.14.1)
- [**npm**](https://www.npmjs.com), [**yarn**](https://yarnpkg.com), or [**pnpm**](https://pnpm.io)
- [**PostgreSQL**](https://www.postgresql.org/download/) 14+ or [**Prisma Postgres**](https://www.prisma.io/docs/getting-started/quickstart-prismaPostgres)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/zaid-khan-code/learnHub-ai-powered-online-learning-platform-lms.git
   cd learnhub-ai-powered-online-learning-platform-lms
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/learnhub"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key-here"
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

   # (Optional) Open Prisma Studio for database management
   npx prisma studio
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
learnhub-ai-powered-online-learning-platform-lms/
├── prisma/
│   ├── schema.prisma          # Database schema & models
│   ├── migrations/            # Database migrations
│   └── config.ts              # Prisma configuration
├── public/                    # Static assets
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API endpoints
│   │   │   ├── courses/      # Courses API
│   │   │   └── progress/     # Progress tracking API
│   │   ├── courses/          # Course pages
│   │   │   ├── [courseId]/   # Dynamic course detail page
│   │   │   │   └── learn/    # Lesson learning interface
│   │   │   │       └── [chapterId]/  # Chapter learning page
│   │   │   └── page.tsx      # Course listing page
│   │   ├── dashboard/        # User dashboards
│   │   │   ├── instructor/   # Instructor dashboard
│   │   │   │   └── courses/  # Course management
│   │   │   │       ├── create/  # Create new course
│   │   │   │       └── [courseId]/ # Edit course
│   │   │   └── student/      # Student dashboard
│   │   │       └── progress/ # Progress tracking
│   │   ├── layout.tsx        # Root layout with theme provider
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   ├── favicon.ico       # Site favicon
│   │   ├── error.tsx         # Error boundary
│   │   └── loading.tsx       # Loading state
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (auto-generated)
│   │   └── theme-provider.tsx # Dark/light theme provider
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── utils.ts          # Utility functions (cn helper)
│   ├── server/
│   │   └── action.ts         # Server actions
│   └── services/             # Business logic services
├── .env                       # Environment variables
├── .env.example              # Example environment variables
├── next.config.ts            # Next.js configuration (React Compiler)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint configuration
├── postcss.config.mjs        # PostCSS configuration
└── README.md                 # Project documentation
```

---

## 🗄️ Database Schema

The application uses a relational PostgreSQL database with the following core models:

### User Roles

- **STUDENT** - Can browse and enroll in courses
- **INSTRUCTOR** - Can create and manage courses
- **ADMIN** - Full platform access

### Course Levels

- **BEGINNER** - Entry-level courses
- **INTERMEDIATE** - Mid-level courses
- **ADVANCED** - Expert-level courses

### Core Models

```prisma
User
├── id: String (cuid)
├── name: String
├── email: String (unique)
├── image: String?
├── role: Role (default: STUDENT)
├── bio: String?
├── courses: Course[]
├── enrollments: Enrollment[]
└── progress: Progress[]

Course
├── id: String (cuid)
├── title: String
├── description: String
├── thumbnail: String?
├── price: Float (default: 0)
├── category: String
├── level: Level (default: BEGINNER)
├── isPublished: Boolean (default: false)
├── instructorId: String
├── rating: Float (default: 0)
├── chapters: Chapter[]
└── enrollments: Enrollment[]

Chapter
├── id: String (cuid)
├── title: String
├── description: String?
├── videoUrl: String?
├── content: String?
├── position: Int
├── isFree: Boolean (default: false)
├── isPublished: Boolean (default: false)
└── courseId: String

Enrollment
├── id: String (cuid)
├── userId: String
├── courseId: String
└── createdAt: DateTime

Progress
├── id: String (cuid)
├── userId: String
├── chapterId: String
├── isCompleted: Boolean (default: false)
└── chapter: Chapter
```

> 📌 **Note:** Run `npx prisma studio` to explore and manage your database visually.

---

## 🌐 API Endpoints

### Courses API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | Get all published courses |
| `POST` | `/api/courses` | Create a new course (Instructor only) |

### Progress API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/progress` | Get user's progress |
| `POST` | `/api/progress` | Update chapter completion status |

---

## 🧪 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma db push` | Push schema to database (dev only) |

### Code Style

This project follows strict TypeScript and ESLint configurations:

- **Strict mode** enabled for maximum type safety
- **React Compiler** enabled for automatic memoization
- **eslint-config-next** for Next.js best practices

---

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [**Vercel**](https://vercel.com):

1. Push your code to a Git repository
2. Import your project in Vercel
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zaid-khan-code/learnHub-ai-powered-online-learning-platform-lms)

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

## 👥 Team

**LearnHub** is a capstone project by 6 talented students from **Saylani Mass IT Training (SMIT)** - **Batch 2026**:

- **Zain Khan** - Full Stack Developer
- **Salman Khan** - Full Stack Developer
- **Zaid Khan** - Full Stack Developer
- **Faisal** - Full Stack Developer
- **Abdullah** - Full Stack Developer
- **Mubeen** - Full Stack Developer

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
- [**SMIT**](https://smit.com.pk) — Saylani Mass IT Training for providing this learning opportunity

---

## 📞 Contact

For questions or support, please open an issue on GitHub or contact the development team.

**Built with ❤️ by the LearnHub Team**
