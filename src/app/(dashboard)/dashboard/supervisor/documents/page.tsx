import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SupervisorReviewZone } from "@/components/dashboard/supervisor-review-zone";
import { ShieldCheck, GraduationCap } from "lucide-react";

export default async function SupervisorDocumentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (
    session.user.role !== "ACADEMIC_SUPERVISOR" &&
    session.user.role !== "ORGANIZATION_SUPERVISOR"
  ) {
    redirect("/dashboard");
  }

  // Fetch all student profiles who have files pending evaluation records
  const studentCohort = await prisma.studentProfile.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      submissions: true,
    },
    orderBy: {
      user: { name: "asc" },
    },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Structural Hero Header Container */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
            <ShieldCheck className="h-3 w-3" />
            Verification Authority Mode
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Academic Clearance Desk
          </h1>
          <p className="text-slate-300 text-xs max-w-xl opacity-85 font-medium">
            Review submitted student validation credentials, audit multi-cloud
            source files, and execute regulatory compliance signoffs.
          </p>
        </div>
      </div>

      {/* Cohort Checklist Flow Wrapper */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2 flex items-center gap-1.5 text-slate-400">
          <GraduationCap className="h-4 w-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Assigned Student Cohort Status Grid ({studentCohort.length})
          </h3>
        </div>

        <SupervisorReviewZone students={studentCohort} />
      </div>
    </div>
  );
}
