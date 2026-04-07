"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  Award,
  StickyNote,
  Heart,
  LogOut,
  Settings,
  X,
  Menu,
  Users,
  PlusCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// --- Functional Logic: Dynamic Links based on Role ---
const getLinks = (role: string) => {
  if (role === "INSTRUCTOR") {
    return [
      {
        label: "Dashboard",
        href: "/dashboard/instructor",
        icon: LayoutDashboard,
        phase: 1,
      },
      {
        label: "My Courses",
        href: "/dashboard/instructor/courses",
        icon: BookOpen,
        phase: 1,
      },
      {
        label: "Create Course",
        href: "/dashboard/instructor/create",
        icon: PlusCircle,
        phase: 1,
      },
      {
        label: "Students",
        href: "/dashboard/instructor/students",
        icon: Users,
        phase: 2,
      },
    ];
  }
  return [
    {
      label: "My Courses",
      href: "/dashboard/student",
      icon: BookOpen,
      phase: 1,
    },
    {
      label: "Progress",
      href: "/dashboard/student/progress",
      icon: LayoutDashboard,
      phase: 2,
    },
    {
      label: "Certificates",
      href: "/dashboard/student/certificates",
      icon: Award,
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
};

interface SidebarProps {
  // Props optional kar diye kyunke hum session se bhi data le sakte hain
  user?: { name?: string | null; email?: string | null; image?: string | null };
  role?: "student" | "instructor" | "admin";
}

function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  // --- Backend Connection ---
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role?.toLowerCase() || "student";
  const links = getLinks(user?.role || "STUDENT");

  const handleLinkClick = () => onClose?.();

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]">
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
        <Link
          href="/"
          className="text-xl font-bold logo-glow"
          onClick={handleLinkClick}
        >
          LearnHub
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isPhase2 = link.phase === 2;
            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-11 text-sm font-medium transition-all ${
                  isPhase2
                    ? "text-gray-600 cursor-not-allowed opacity-60"
                    : isActive
                      ? "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 amber-glow"
                      : "text-gray-400 hover:text-[#F97316]"
                }`}
                asChild={!isPhase2}
                disabled={isPhase2}
                onClick={handleLinkClick}
              >
                {!isPhase2 ? (
                  <Link href={link.href}>
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 space-y-3 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-[#F97316]/20">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="bg-[#F97316]/20 text-[#F97316] font-bold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="truncate text-sm font-medium text-gray-200">
              {user?.name || "User"}
            </p>
            <Badge
              variant="outline"
              className="text-[10px] border-[#F97316]/30 text-[#F97316] capitalize"
            >
              {role}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-gray-400 hover:text-[#F97316]"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full justify-start gap-3 h-10 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname() || "";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-white/10 bg-[#0e0e0e]">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0e0e0e] border-b border-white/10 z-50 flex items-center justify-between px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-200 h-10 w-10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-70 sm:w-[320px] p-0 bg-[#0e0e0e] border-r border-white/10"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent pathname={pathname} onClose={() => {}} />
          </SheetContent>
        </Sheet>
        <Link href="/" className="text-lg font-bold logo-glow">
          LearnHub
        </Link>
        <div className="w-10" />
      </header>
      <div className="lg:hidden h-16" />
    </>
  );
}
