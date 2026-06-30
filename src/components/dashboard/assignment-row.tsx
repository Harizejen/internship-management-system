"use client";

import { useState } from "react";
import { assignAcademicSupervisorAction } from "@/app/actions/admin";
import { Loader2, CheckCircle } from "lucide-react";

interface AssignmentRowProps {
  student: any;
  supervisors: { id: string; name: string }[];
}

export function AssignmentRow({ student, supervisors }: AssignmentRowProps) {
  const [currentSupervisorId, setCurrentSupervisorId] = useState(
    student.academicSupervisorId || "unassigned",
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    setIsUpdating(true);
    setShowSuccess(false);

    const formData = new FormData();
    formData.append("studentProfileId", student.id);
    formData.append("supervisorId", selectedId);

    const result = await assignAcademicSupervisorAction(formData);

    if (result?.success) {
      setCurrentSupervisorId(selectedId);
      setIsUpdating(false);
      setShowSuccess(true);
      // Fade out success checkmark after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      alert(result?.error || "Failed to update allocation.");
      setIsUpdating(false);
    }
  }

  return (
    <tr className="border-b border-[#e2e8f0] bg-white hover:bg-slate-50/50 transition-colors text-sm text-slate-700">
      <td className="px-4 py-3 font-semibold text-slate-900">
        {student.user.name}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">
        {student.matricId}
      </td>
      <td className="px-4 py-3 text-xs font-medium text-slate-500">
        {student.course}
      </td>
      <td className="px-4 py-3 max-w-xs">
        <div className="flex items-center gap-2">
          <select
            value={currentSupervisorId}
            onChange={handleSelectChange}
            disabled={isUpdating}
            className="h-9 w-full rounded-xl border border-[#e2e8f0] bg-white px-3 text-xs font-medium text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="unassigned">⚠️ Unassigned / No Lecturer</option>
            {supervisors.map((sup) => (
              <option key={sup.id} value={sup.id}>
                👨‍🏫 {sup.name}
              </option>
            ))}
          </select>

          {/* Action State Micro-feedback Indicators */}
          <div className="w-5 flex items-center justify-center">
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            )}
            {showSuccess && (
              <CheckCircle className="h-4 w-4 text-emerald-500 animate-scale-in" />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
