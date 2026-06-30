import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewCard } from "@/components/dashboard/review-card";
import { ClipboardList, Sparkles } from "lucide-react";

export default async function ReviewPage() {
  const session = await auth();
  const role = session?.user?.role;

  // Enforce access control bounds directly at server rendering layer
  if (
    !session?.user?.id ||
    (role !== "ACADEMIC_SUPERVISOR" &&
      role !== "ORGANIZATION_SUPERVISOR" &&
      role !== "ADMIN")
  ) {
    redirect("/dashboard");
  }

  // Look up entries that need verification signature based on user identity type
  const entries = await prisma.logbookEntry.findMany({
    where: {
      ...(role === "ORGANIZATION_SUPERVISOR" ? { orgApproved: false } : {}),
      ...(role === "ACADEMIC_SUPERVISOR" ? { acadApproved: false } : {}),
      ...(role === "ADMIN"
        ? { OR: [{ orgApproved: false }, { acadApproved: false }] }
        : {}),
    },
    include: {
      student: {
        include: { user: true },
      },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Dynamic Header Box */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-8 text-white shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <ClipboardList className="h-24 w-24 text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Logbook Verification Desk
          </h1>
          <p className="text-slate-300 text-sm max-w-xl opacity-90">
            Review incoming industrial activity logs committed by candidates
            under your oversight. Leave feedback and sign off to verify their
            target requirements.
          </p>
        </div>
      </div>

      {/* Main Stream Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Pending Approval Queue
          </h3>
          <span className="text-xs font-mono font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
            {entries.length} Items Awaiting Sign-off
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-sm">
            <p className="font-medium text-sm">Queue Clear!</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no log records currently waiting for your verification
              stamp.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <ReviewCard
                key={entry.id}
                entry={entry}
                currentRole={role || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
