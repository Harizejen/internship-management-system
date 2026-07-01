import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Briefcase, Building2, Calendar, Mail, UserCheck } from "lucide-react";
import { PlacementFormClient } from "@/components/dashboard/placement-form-client";

export default async function StudentPlacementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  // Fetch current student baseline properties alongside supervisor sub-tables
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: { orgSupervisor: true },
  });

  if (!profile) {
    return (
      <div className="p-6 text-center text-sm font-semibold text-slate-500">
        No student configuration matrix mapped to your active session token.
      </div>
    );
  }

  // Format initial date strings for the raw HTML input templates safely
  const initialData = {
    organizationName: profile.organizationName || "",
    startDate: profile.startDate
      ? profile.startDate.toISOString().split("T")[0]
      : "",
    endDate: profile.endDate ? profile.endDate.toISOString().split("T")[0] : "",
    mentorName: profile.orgSupervisor?.name || "",
    mentorEmail: profile.orgSupervisor?.email || "",
    status: profile.status,
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-fade-in pb-6">
      {/* Dynamic Upper Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-950 to-blue-950 p-4 md:p-5 text-white border border-[#e2e8f0]/10 shadow-xs">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
            <Briefcase className="h-3 w-3" />
            Company Placement Ecosystem Configuration
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Internship Profile Workspace
          </h1>
          <p className="text-slate-300 text-xs max-w-xl font-medium opacity-85">
            Document your current corporate deployment station and associate
            your on-site external supervisor.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        {/* Left Core Form Input Card Frame */}
        <div className="md:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <PlacementFormClient initialData={initialData} />
        </div>

        {/* Right Info Sidebar Status Block Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verification Lifecycle
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Your live deployment checkpoint status.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-[#e2e8f0] p-3 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  profile.status === "ONGOING"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {profile.status}
              </span>
              <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                {profile.status === "PENDING"
                  ? "Please declare your company info below to provision workspace logbook generation access variables."
                  : "Your placement metrics are active. Your industry supervisor can now check their inbox for authentication requests."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
