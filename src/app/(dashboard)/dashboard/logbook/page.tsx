import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogbookForm } from "@/components/dashboard/logbook-form";
import { LogbookCalendarViewSwitch } from "@/components/dashboard/logbook-calendar-view-switch"; // 💡 Central view controller
import { Sparkles } from "lucide-react";

export default async function LogbookPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the current student profile alongside their logbook entries
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      logbookEntries: {
        orderBy: { date: "desc" },
      },
    },
  });

  const entries = studentProfile?.logbookEntries || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* 🚀 Modern Top Header Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-24 w-24 text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text bg-linear-to-r from-white via-slate-100 to-slate-300">
            Daily Industrial Logbook
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl font-medium opacity-90">
            Document your core engineering tasks, log hours seamlessly, and
            track verification metrics across supervisors.
          </p>
        </div>
      </div>

      {/* Main Structural Interface Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Input Form Container */}
        <div className="lg:col-span-4 sticky top-6">
          <LogbookForm />
        </div>

        {/* Right Side: Dynamic Calendar Matrix & List Stream Wrapper */}
        <div className="lg:col-span-8">
          <LogbookCalendarViewSwitch entries={entries} />
        </div>
      </div>
    </div>
  );
}
