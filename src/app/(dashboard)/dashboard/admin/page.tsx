import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssignmentRow } from "@/components/dashboard/assignment-row";
import { ShieldCheck } from "lucide-react";

export default async function AdminAssignmentPage() {
  const session = await auth();
  const role = session?.user?.role;

  // 1. Structural Security Guard: Instant block if malicious actors try peaking in
  if (!session?.user?.id || role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 2. Fetch all student profiles alongside their current supervisor relationship linkages
  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      academicSupervisor: true,
    },
    orderBy: { matricId: "asc" },
  });

  // 3. Fetch all users registered inside the system with the explicit Lecturer/Supervisor role
  const lecturers = await prisma.user.findMany({
    where: { role: "ACADEMIC_SUPERVISOR" },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-fade-in">
      {/* Compact Admin Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-950 p-4 md:p-5 text-white shadow-xs border border-slate-800">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            Administrative Authority Mode
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Lecturer Allocation Desk
          </h1>
          <p className="text-slate-300 text-xs max-w-xl font-medium opacity-85">
            Assign registered university academic supervisors to active student
            profiles to build evaluation workflows.
          </p>
        </div>
      </div>

      {/* Modern Compact Data Table */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold tracking-tight text-slate-800">
            Active Student Cohort Assignment Stream
          </h3>
          <span className="text-[11px] font-mono font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
            {students.length} Total Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Matric ID</th>
                <th className="px-4 py-3">Course Code</th>
                <th className="px-4 py-3">Assigned Academic Supervisor</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm font-medium text-slate-400"
                  >
                    No active student records discovered inside the database
                    pipeline cluster.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <AssignmentRow
                    key={student.id}
                    student={student}
                    supervisors={lecturers}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
