"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  Award,
  StickyNote,
  Heart,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Student Sidebar Links (Section 07)
const studentLinks = [
  { label: "My Courses", href: "/dashboard/student", icon: BookOpen, phase: 1 },
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

interface SidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  role: "student" | "instructor" | "admin";
}

interface SidebarContentProps {
  pathname: string | null;
  user: SidebarProps["user"];
  role: SidebarProps["role"];
  onClose?: () => void; // ✅ Optional close callback for mobile
}

function SidebarContent({
  pathname,
  user,
  role,
  onClose,
}: SidebarContentProps) {
  const handleLinkClick = () => {
    onClose?.(); // Close mobile sheet when link is clicked
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
        <Link
          href="/"
          className="text-xl font-bold logo-glow hover:opacity-90 transition-opacity"
          onClick={handleLinkClick}
        >
          LearnHub
        </Link>
        {/* ✅ Close button ONLY for mobile - uses regular Button, not SheetClose */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 hover:text-[#F97316] h-8 w-8"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation Links with ScrollArea */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {studentLinks.map((link) => {
            const isActive = pathname === link.href;
            const isPhase2 = link.phase === 2;

            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-11 text-sm font-medium transition-all ${
                  isPhase2
                    ? "text-gray-600 hover:bg-white/5 cursor-not-allowed opacity-60"
                    : isActive
                      ? "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 amber-glow hover:bg-[#F97316]/15"
                      : "text-gray-400 hover:text-[#F97316] hover:bg-[#F97316]/5"
                }`}
                asChild={!isPhase2}
                disabled={isPhase2}
                onClick={handleLinkClick}
              >
                {isPhase2 ? (
                  <span>
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                ) : (
                  <Link href={link.href}>
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-white/10">
        {/* User Profile */}
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
            <div className="flex items-center gap-2">
              <p className="truncate text-xs text-gray-500 capitalize">
                {role}
              </p>
              <Badge
                variant="outline"
                className="text-[10px] border-[#F97316]/30 text-[#F97316] shrink-0"
              >
                {role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Settings & Sign Out */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-gray-400 hover:text-[#F97316] hover:bg-[#F97316]/5"
            onClick={handleLinkClick}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              handleLinkClick();
              signOut({ callbackUrl: "/login" });
            }}
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

export default function Sidebar({ user, role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ============================================
          DESKTOP SIDEBAR (≥1024px)
          Section 07: 240px fixed left panel
      ============================================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[240px] flex-col border-r border-white/10 bg-[#0e0e0e]">
        {/* ✅ No onClose for desktop - no Sheet context needed */}
        <SidebarContent pathname={pathname} user={user} role={role} />
      </aside>

      {/* ============================================
          MOBILE HEADER (<1024px)
          Section 07: Hamburger menu + Logo
      ============================================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0e0e0e] border-b border-white/10 z-50 flex items-center justify-between px-4">
        {/* Hamburger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-200 hover:text-[#F97316] hover:bg-[#F97316]/10 h-10 w-10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          {/* ✅ Mobile Sheet - onClose passed to SidebarContent */}
          <SheetContent
            side="left"
            className="w-[280px] sm:w-[320px] p-0 bg-[#0e0e0e] border-r border-white/10"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            {/* ✅ Pass onClose to close sheet when links are clicked */}
            <SidebarContent
              pathname={pathname}
              user={user}
              role={role}
              onClose={() => {}}
            />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold logo-glow hover:opacity-90 transition-opacity"
        >
          LearnHub
        </Link>

        {/* Spacer for balance */}
        <div className="w-10" />
      </header>

      {/* ============================================
          SPACER FOR MOBILE HEADER
          Prevents content from hiding under fixed header
      ============================================= */}
      <div className="lg:hidden h-16" />
    </>
  );
}
