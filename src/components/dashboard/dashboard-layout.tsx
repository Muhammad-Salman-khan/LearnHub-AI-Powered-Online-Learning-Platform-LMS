import { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  Certificate,
  LayoutDashboard,
  LogOut,
  Settings,
  StickyNote,
  Heart,
} from "lucide-react";

// Student Sidebar Links (Phase 1 Core)
const studentLinks = [
  { label: "My Courses", href: "/dashboard/student", icon: BookOpen },
  {
    label: "Progress",
    href: "/dashboard/student/progress",
    icon: LayoutDashboard,
    phase: 2,
  },
  {
    label: "Certificates",
    href: "/dashboard/student/certificates",
    icon: Certificate,
    phase: 2,
  },
  {
    label: "Notes",
    href: "/dashboard/student/notes",
    icon: StickyNote,
    phase: 2,
  },
  {
    label: "Wishlist",
    href: "/dashboard/student/wishlist",
    icon: Heart,
    phase: 2,
  },
];

export default function DashboardLayout({
  children,
  user,
}: {
  children: ReactNode;
  user: { name: string; role: string };
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed 240px */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r bg-white hidden lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            LearnHub
          </Link>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {studentLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${link.phase === 2 ? "text-gray-400 hover:bg-gray-100" : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}
              `}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 lg:pl-[240px]">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
