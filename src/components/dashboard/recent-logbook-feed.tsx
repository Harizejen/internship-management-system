"use client";

import Link from "next/link";
import { History, ArrowRight } from "lucide-react";

interface RecentLogbookFeedProps {
  entries: any[];
}

export function RecentLogbookFeed({ entries }: RecentLogbookFeedProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Logbook Activity
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Timeline snapshot of your latest committed workplace journal
              items.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/logbook"
          className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 hover:underline"
        >
          View Full Logbook <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2.5 pt-1">
        {entries.length === 0 ? (
          <div className="text-center p-6 text-slate-400 text-xs italic border border-dashed border-slate-100 rounded-xl">
            No entries have been recorded yet. Select calendar dates to
            initialize logging sequences.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-slate-100 bg-slate-50/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all hover:bg-slate-50/70"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded-md font-mono">
                    Wk {entry.weekNumber} · {entry.hoursWorked.toFixed(1)} Hrs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  {entry.activityDetails ||
                    "No descriptive logs registered for this operational day sequence."}
                </p>
              </div>

              {/* Dual Supervisor Signature Badge Columns */}
              <div className="flex gap-1.5 shrink-0 select-none">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    entry.orgApproved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                      : "bg-slate-50 text-slate-400 border-slate-200/40"
                  }`}
                >
                  Org
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    entry.acadApproved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                      : "bg-slate-50 text-slate-400 border-slate-200/40"
                  }`}
                >
                  Acad
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
