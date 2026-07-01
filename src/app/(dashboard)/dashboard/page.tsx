import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  Users,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { SupervisorCharts } from "@/components/dashboard/supervisor-charts";

// 💡 NEW COMPONENT IMPRINTS FOR THE STUDENT WORKSPACE COCKPIT
import { PlacementCountdown } from "@/components/dashboard/placement-countdown";
import { DocumentComplianceWidget } from "@/components/dashboard/document-compliance-widget";
import { RecentLogbookFeed } from "@/components/dashboard/recent-logbook-feed";
import { StudentHoursChart } from "@/components/dashboard/student-hours-chart";

export default async function DashboardRootPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;
  const userName = session?.user?.name || "User";

  // Initialize data stores
  let studentStats = { totalHours: 0, entriesCount: 0, approvedCount: 0 };
  let supervisorStats = {
    assignedStudents: 0,
    totalPending: 0,
    totalVerified: 0,
  };
  let chartData: { name: string; verified: number; pending: number }[] = [];

  // New unified type-safe containers for student sub-metrics
  let studentProfileRaw: any = null;
  let studentWeeklyChartRaw: { name: string; hours: number }[] = [];

  // =========================================================================
  // DATA FETCHING LAYER: SUPERVISOR ANALYTICS
  // =========================================================================
  if (
    (role === "ACADEMIC_SUPERVISOR" || role === "ORGANIZATION_SUPERVISOR") &&
    userId
  ) {
    supervisorStats.assignedStudents = await prisma.studentProfile.count({
      where: {
        ...(role === "ACADEMIC_SUPERVISOR"
          ? { academicSupervisorId: userId }
          : {}),
        ...(role === "ORGANIZATION_SUPERVISOR"
          ? { orgSupervisorId: userId }
          : {}),
      },
    });

    const logbookSummary = await prisma.logbookEntry.findMany({
      where: {
        student: {
          ...(role === "ACADEMIC_SUPERVISOR"
            ? { academicSupervisorId: userId }
            : {}),
          ...(role === "ORGANIZATION_SUPERVISOR"
            ? { orgSupervisorId: userId }
            : {}),
        },
      },
      select: {
        acadApproved: true,
        orgApproved: true,
        date: true,
      },
    });

    logbookSummary.forEach((entry) => {
      const isVerified =
        role === "ACADEMIC_SUPERVISOR" ? entry.acadApproved : entry.orgApproved;
      if (isVerified) {
        supervisorStats.totalVerified++;
      } else {
        supervisorStats.totalPending++;
      }
    });

    chartData = [
      {
        name: "Week 1",
        verified: supervisorStats.totalVerified,
        pending: supervisorStats.totalPending,
      },
      { name: "Week 2", verified: 0, pending: 0 },
      { name: "Week 3", verified: 0, pending: 0 },
    ];
  }

  // =========================================================================
  // DATA FETCHING LAYER: SUPERVISED STUDENT EXPANSION MODULE
  // =========================================================================
  if (role === "STUDENT" && userId) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        logbookEntries: { orderBy: { date: "desc" } },
        submissions: true,
      },
    });

    if (profile) {
      studentProfileRaw = profile;
      studentStats.entriesCount = profile.logbookEntries.length;
      studentStats.totalHours = profile.logbookEntries.reduce(
        (sum, e) => sum + e.hoursWorked,
        0,
      );
      studentStats.approvedCount = profile.logbookEntries.filter(
        (e) => e.orgApproved && e.acadApproved,
      ).length;

      // Map raw logged entries into a clean weekly chart matrix
      const weeklyAggregation: Record<number, number> = {};
      profile.logbookEntries.forEach((entry) => {
        weeklyAggregation[entry.weekNumber] =
          (weeklyAggregation[entry.weekNumber] || 0) + entry.hoursWorked;
      });

      studentWeeklyChartRaw = Object.keys(weeklyAggregation)
        .map((week) => ({
          name: `Week ${week}`,
          hours: weeklyAggregation[Number(week)],
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        );
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Premium Adaptive Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 p-4 md:p-5 text-white shadow-xs border border-[#e2e8f0]/10">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
            <Sparkles className="h-3 w-3" />
            Active Session Roster — {role?.replace("_", " ")}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome Back, {userName}
          </h1>
          <p className="text-slate-300 text-xs max-w-xl font-medium opacity-85">
            Monitor logbook submission volume, sign off pending student
            requirements, and manage evaluation groups.
          </p>
        </div>
      </div>

      {/* =========================================================================
          SUPERVISOR VIEWPORT METRICS & CHARTS
         ========================================================================= */}
      {(role === "ACADEMIC_SUPERVISOR" ||
        role === "ORGANIZATION_SUPERVISOR") && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Assigned Cohort
                </span>
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                  {supervisorStats.assignedStudents}
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Students
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Action Needed
                </span>
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                  {supervisorStats.totalPending}
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Pending Logs
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Verified Records
                </span>
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                  {supervisorStats.totalVerified}
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Completed Sign-offs
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
              <SupervisorCharts data={chartData} />
            </div>
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight">
                  Supervisor Tasks
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Quick navigation system shortcuts.
                </p>
              </div>
              <div className="space-y-2 mt-4">
                <Link
                  href="/dashboard/supervisor/documents"
                  className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f4f6fa] px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Open Verification Desk Queue
                  <span className="bg-amber-500 text-white font-mono px-2 py-0.5 rounded text-[10px]">
                    {supervisorStats.totalPending}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDENT VIEWPORT LAYOUT RE-RENDERED AS AN ASYMMETRIC CONTROL COCKPIT
         ========================================================================= */}
      {role === "STUDENT" && studentProfileRaw && (
        <div className="space-y-6">
          {/* Top Quick Stats Row Banner */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Hours Metric
                </span>
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-800 mt-4 font-mono">
                {studentStats.totalHours.toFixed(1)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Commits
                </span>
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-800 mt-4 font-mono">
                {studentStats.entriesCount}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Approvals
                </span>
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-800 mt-4 font-mono">
                {studentStats.approvedCount}
              </p>
            </div>
          </div>

          {/* 📐 THE ASYMMETRIC GRID WORKSPACE (70% Left Main / 30% Right Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Main Workspace Column (70% Width) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <StudentHoursChart data={studentWeeklyChartRaw} />
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <RecentLogbookFeed
                  entries={studentProfileRaw.logbookEntries.slice(0, 4)}
                />
              </div>
            </div>

            {/* Right Information Sidebar Column (30% Width) */}
            <div className="space-y-6">
              <PlacementCountdown profile={studentProfileRaw} />
              <DocumentComplianceWidget
                submissions={studentProfileRaw.submissions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
