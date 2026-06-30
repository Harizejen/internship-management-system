import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogbookForm } from "@/components/dashboard/logbook-form";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default async function LogbookPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

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

        {/* Right Side: Timeline History Container */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">
              System Operational History
            </h3>
            <span className="text-xs font-mono font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-1 rounded-full">
              {entries.length} {entries.length === 1 ? "Entry" : "Entries"}{" "}
              Total
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <CalendarDays className="h-8 w-8 text-slate-400" />
              </div>
              <p className="font-medium text-sm">
                No daily entries committed to the cloud layer yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Use the entry manager widget to launch your first log record.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/80 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-start justify-between gap-6 overflow-hidden"
                >
                  {/* Subtle hover accent element bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md dark:bg-slate-800 dark:text-slate-300">
                        <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                        {new Date(entry.date).toLocaleDateString("en-MY", {
                          dateStyle: "medium",
                        })}
                      </div>
                      <span className="bg-indigo-50/70 text-indigo-700 px-2.5 py-1 rounded-md dark:bg-indigo-950/30 dark:text-indigo-400">
                        Week {entry.weekNumber}
                      </span>
                      <span className="bg-emerald-50/70 text-emerald-700 px-2.5 py-1 rounded-md dark:bg-emerald-950/30 dark:text-emerald-400 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />{" "}
                        {entry.hoursWorked.toFixed(1)} hrs
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal whitespace-pre-line pl-0.5">
                      {entry.activityDetails}
                    </p>
                  </div>

                  {/* Dual-Supervisor Layout Verification Control Center */}
                  <div className="flex flex-row sm:flex-col gap-2 self-start sm:self-auto items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 justify-between sm:justify-start">
                    <div className="text-xs text-slate-400 font-medium sm:hidden">
                      Approvals:
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <div
                        className={`text-[11px] font-bold tracking-wide uppercase rounded-md px-2.5 py-1 flex items-center gap-1.5 shadow-xs border ${
                          entry.orgApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                        }`}
                      >
                        {entry.orgApproved ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <HelpCircle className="h-3 w-3 text-amber-500" />
                        )}
                        <span>
                          Host: {entry.orgApproved ? "Verified" : "Pending"}
                        </span>
                      </div>

                      <div
                        className={`text-[11px] font-bold tracking-wide uppercase rounded-md px-2.5 py-1 flex items-center gap-1.5 shadow-xs border ${
                          entry.acadApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                        }`}
                      >
                        {entry.acadApproved ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <HelpCircle className="h-3 w-3 text-amber-500" />
                        )}
                        <span>
                          Faculty: {entry.acadApproved ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
