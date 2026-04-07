  "use client";

  import { Button } from "@/components/ui/button";
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import { DashboardSidebar } from "./dashboard-sidebar";

  interface DashboardNavbarProps {
    title: string;
    role: "student" | "instructor" | "admin";
    // ✅ Ye props add karna zaroori hain taake parent page se link ho sakein
    sidebarOpen?: boolean;
    setSidebarOpen?: (open: boolean) => void;
  }

  export function DashboardNavbar({ 
    title, 
    role, 
    sidebarOpen, 
    setSidebarOpen 
  }: DashboardNavbarProps) {
    return (
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="flex items-center gap-4">
          {/* ✅ Mobile Menu Trigger (Sirf Mobile par dikhega) */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="material-symbols-outlined">menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[240px] p-0 bg-background border-r border-border"
            >
              {/* Sidebar ko role pass karna zaroori hai backend data ke liye */}
              <DashboardSidebar 
                role={role} 
                onClose={() => setSidebarOpen?.(false)} 
              />
            </SheetContent>
          </Sheet>

          {/* ✅ Title: Ab ye Desktop aur Mobile dono par dikhega */}
          <h1 className="font-bold text-xl text-foreground truncate max-w-[250px] md:max-w-none">
            {title}
          </h1>
        </div>

        {/* Right Side: Profile ya Notifications (Optional) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {role}
          </div>
        </div>
      </header>
    );
  }