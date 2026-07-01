"use client";

import Link from "next/link";
import {
  FolderUp,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface DocumentComplianceWidgetProps {
  submissions: any[];
}

export function DocumentComplianceWidget({
  submissions,
}: DocumentComplianceWidgetProps) {
  // 💡 THE ACCURACY FIX: Track total uploaded files regardless of supervisor review status
  const totalStaged = submissions.length;
  const verifiedCount = submissions.filter(
    (s) => s.status === "APPROVED",
  ).length;
  const rejectedCount = submissions.filter(
    (s) => s.status === "REJECTED",
  ).length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  // Base the main percentage metric on files actually pushed into the system
  const compliancePercentage = Math.round((totalStaged / 4) * 100);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Compliance Rating
          </span>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight">
            Credential Clearances
          </h4>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <FolderUp className="h-4 w-4" />
        </div>
      </div>

      {/* Visual Progress Ring Wrapper */}
      <div className="flex items-center gap-4 bg-slate-50/60 border border-slate-100 rounded-xl p-3">
        <div className="relative h-11 w-11 shrink-0 rounded-full border-2 border-slate-100 flex items-center justify-center font-mono text-xs font-black text-slate-700 bg-white shadow-xs">
          {compliancePercentage}%
        </div>
        <div className="text-[11px] font-medium text-slate-400 leading-snug">
          {/* 💡 Shows the actual number of files sitting in the system */}
          <p className="font-bold text-slate-700">
            <span className="font-mono">{totalStaged}</span> of 4 Files Staged
          </p>
          <p className="text-[10px] mt-0.5">
            Official clearance files required for dynamic credit evaluation
            tracks.
          </p>
        </div>
      </div>

      {/* 💡 MICRO STATUS BREAKDOWNGRID: Shows verification audit states in real-time */}
      {totalStaged > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-bold border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/40 border border-emerald-100/50 p-1.5 rounded-lg">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{verifiedCount} Verified</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50/40 border border-amber-100/50 p-1.5 rounded-lg">
            <Clock
              className="h-3.5 w-3.5 text-amber-500 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span>{pendingCount} Pending</span>
          </div>
        </div>
      )}

      {/* Warning loop indicator for rejections */}
      {rejectedCount > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-[10px] font-bold text-red-800 flex items-center gap-2 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <span>Action Required: {rejectedCount} File Needs Revision!</span>
        </div>
      )}

      {/* Shortcut Anchor Link */}
      <Link
        href="/dashboard/documents"
        className="w-full border border-[#e2e8f0] bg-white hover:bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
      >
        <span>Manage Cloud Uploads</span>
        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
      </Link>
    </div>
  );
}
