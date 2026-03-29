import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">

      <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
        LearnHub
      </h1>

      <ul className="hidden md:flex items-center gap-8">
        <li>
          <Link href="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link href="/courses" className="nav-link">Courses</Link>
        </li>
        <li>
          <Link href="/dashboard/student" className="nav-link">My Learning</Link>
        </li>
        <li>
          <Link href="/dashboard/instructor" className="nav-link">Teach</Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search courses..."
          className="hidden md:block px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Link
          href="/login"
          className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Sign In
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}