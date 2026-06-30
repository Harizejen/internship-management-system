import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/dashboard/sidebar-nav"; // 💡 Import our new component
import { LayoutDashboard, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f4f6fa] dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Sidebar Panel Container */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#e2e8f0] bg-[#edf2f7] p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="rounded-lg bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-900">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">IMS Portal</span>
        </div>

        {/* 💡 REPLACED THE OLD NAV BLOCK WITH OUR DYNAMIC CLIENT NAV */}
        <SidebarNav role={session?.user?.role} />

        {/* User Workspace Profile Footer Widget */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 px-2 pb-3">
            <div className="flex flex-col min-w-0">
              <p className="truncate text-sm font-semibold">
                {session?.user?.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400 font-mono">
                {session?.user?.role}
              </p>
            </div>
          </div>
          <form action={handleSignOut}>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400 h-9 px-3"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit Session
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Work Area Workspace Viewport */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <span className="font-bold">IMS Mobile Bar</span>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
