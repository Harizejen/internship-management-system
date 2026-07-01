import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentUploadZone } from "@/components/dashboard/document-upload-zone";
import { FolderUp, ShieldCheck } from "lucide-react";

export default async function StudentDocumentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  // Fetch student profile details matching submissions array vectors
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      submissions: true,
    },
  });

  const submissions = studentProfile?.submissions || [];
  const completionPercentage = Math.round((submissions.length / 4) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Upper Layout Branding Card Dashboard Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-950 to-indigo-950 p-6 text-white border border-slate-800 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
              <FolderUp className="h-3 w-3" />
              Academic Credential Repository
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Institutional Document Manager
            </h1>
            <p className="text-slate-300 text-xs max-w-xl opacity-85 font-medium">
              Upload and review official university clearance documents,
              training confirmation certificates, and final internship reports.
            </p>
          </div>

          {/* Compliance tracking metric progress arc counter bar */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-500 font-mono font-bold text-sm text-white shadow-inner">
              {completionPercentage}%
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Compliance Rating
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {submissions.length} of 4 Files Staged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Dashboard Checklist Widget Container */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Mandatory Placement Milestone Submissions
          </h3>
        </div>

        <DocumentUploadZone existingSubmissions={submissions} />
      </div>
    </div>
  );
}
