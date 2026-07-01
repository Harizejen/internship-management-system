"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Briefcase,
  FolderUp,
} from "lucide-react";

interface SidebarNavProps {
  role?: string;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
      shouldRender: true,
    },
    {
      href: "/dashboard/logbook",
      label: "Daily Logbook",
      icon: BookOpen,
      isActive: pathname === "/dashboard/logbook",
      shouldRender: role === "STUDENT",
    },
    {
      href: "/dashboard/review",
      label: "Review Students",
      icon: Users,
      isActive: pathname.startsWith("/dashboard/review"),
      shouldRender:
        role === "ACADEMIC_SUPERVISOR" || role === "ORGANIZATION_SUPERVISOR",
    },
    {
      href: "/dashboard/admin",
      label: "Manage Assignments",
      icon: Users, // You can swap this to ShieldAlert or ClipboardList if preferred
      isActive: pathname === "/dashboard/admin",
      shouldRender: role === "ADMIN",
    },
    {
      href: "/dashboard/placement",
      label: "Internship Placement",
      icon: Briefcase,
      isActive: pathname === "/dashboard/placement",
      shouldRender: role === "STUDENT",
    },
    {
      href: "/dashboard/documents",
      label: "Document Submissions",
      icon: FolderUp,
      isActive: pathname === "/dashboard/documents",
      shouldRender: role === "STUDENT",
    },
  ];

  return (
    <nav className="flex-1 space-y-1 py-4">
      {menuItems.map((item) => {
        if (!item.shouldRender) return null;

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              item.isActive
                ? "bg-white text-indigo-600 shadow-xs border border-[#e2e8f0]"
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900 transition-all duration-150"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
