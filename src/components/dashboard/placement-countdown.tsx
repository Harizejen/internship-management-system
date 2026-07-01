"use client";

import { Briefcase, Calendar, Info } from "lucide-react";

interface PlacementCountdownProps {
  profile: {
    organizationName: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
  };
}

export function PlacementCountdown({ profile }: PlacementCountdownProps) {
  if (!profile.organizationName || !profile.startDate || !profile.endDate) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-600">
          <Info className="h-4 w-4 shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Placement Status
          </h4>
        </div>
        <p className="text-xs font-bold text-slate-800">
          Awaiting Corporate Assignment
        </p>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          Your industrial placement sequence is currently pending verification.
          Please update your target files to trigger mentor assignments.
        </p>
        <div className="pt-1">
          <span className="bg-amber-50 border border-amber-200 text-amber-700 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-md">
            Pending Allocation
          </span>
        </div>
      </div>
    );
  }

  const now = new Date();
  const start = new Date(profile.startDate);
  const end = new Date(profile.endDate);

  const totalTime = end.getTime() - start.getTime();
  const totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

  const elapsedTime = now.getTime() - start.getTime();
  const daysCompleted = Math.max(
    0,
    Math.ceil(elapsedTime / (1000 * 60 * 60 * 24)),
  );

  const daysRemaining = Math.max(0, totalDays - daysCompleted);
  const progressPercent = Math.min(
    100,
    Math.round((daysCompleted / totalDays) * 100),
  );
  const currentWeek = Math.min(
    Math.ceil(totalDays / 7),
    Math.ceil(daysCompleted / 7),
  );
  const totalWeeks = Math.ceil(totalDays / 7);

  const isFutureInternship = now.getTime() < start.getTime();

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Assigned Workplace
          </span>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
            {profile.organizationName}
          </h4>
        </div>
        <div className="p-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl shrink-0">
          <Briefcase className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-400">Timeline Progression</span>
          <span className="text-indigo-600 font-mono">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
        <div className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Duration Track
          </span>
          <span className="text-xs font-extrabold text-slate-700 block mt-0.5 font-mono">
            {isFutureInternship
              ? "Staging Mode"
              : `Week ${currentWeek} of ${totalWeeks}`}
          </span>
        </div>
        <div className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Clock Countdown
          </span>
          <span className="text-xs font-extrabold text-slate-700 block mt-0.5 font-mono">
            {daysRemaining === 0
              ? "Completed 🎉"
              : `${daysRemaining} Days Left`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-0.5">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span>Frame:</span>
        <span className="text-slate-600 font-mono font-bold">
          {start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          –{" "}
          {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
