"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  X,
} from "lucide-react";

import "react-day-picker/dist/style.css";

interface LogbookCalendarProps {
  entries: any[];
}

export function LogbookCalendar({ entries }: LogbookCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  // Group entries into database validation categories
  const approvedDates = entries
    .filter((e) => e.orgApproved && e.acadApproved)
    .map((e) => new Date(e.date));

  const flaggedDates = entries
    .filter((e) => e.orgFeedback || e.acadFeedback)
    .map((e) => new Date(e.date));

  const pendingDates = entries
    .filter(
      (e) =>
        !e.orgApproved && !e.acadApproved && !e.orgFeedback && !e.acadFeedback,
    )
    .map((e) => new Date(e.date));

  // Custom pastel style tokens mapping
  const modifiersStyles = {
    approved: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      color: "#047857",
      fontWeight: "bold",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      borderRadius: "12px",
    },
    flagged: {
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      color: "#b45309",
      fontWeight: "bold",
      border: "1px solid rgba(245, 158, 11, 0.4)",
      borderRadius: "12px",
    },
    pending: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      color: "#1d4ed8",
      fontWeight: "bold",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "12px",
    },
  };

  const handleDayClick = (day: Date) => {
    const match = entries.find((e) => isSameDay(new Date(e.date), day));
    if (match) setSelectedEntry(match);
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
      {/* Side-by-Side Split Workspace Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column Container: Compact DayPicker Calendar Engine Frame */}
        <div className="md:col-span-7 flex flex-col items-center">
          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            onDayClick={handleDayClick}
            modifiers={{
              approved: approvedDates,
              flagged: flaggedDates,
              pending: pendingDates,
            }}
            modifiersStyles={modifiersStyles}
            showOutsideDays
            className="border-none p-0 m-0 font-sans"
            // 💡 REVISED CLASSNAMES FOR VERSION 9: Centers label, splits buttons on left/right edges
            classNames={{
              months: "relative flex flex-col gap-4 w-full",
              month_caption:
                "relative flex items-center justify-center w-full mb-4 pb-4 border-b border-slate-100 h-9",
              caption_label:
                "text-sm font-bold text-slate-800 tracking-tight text-center select-none",

              // 🌟 THE FIX: Added px-1 to give the buttons breathing room from the edges
              nav: "absolute inset-x-0 flex justify-between items-center w-full pointer-events-none z-10 px-1",

              button_previous:
                "p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded-lg transition-all border border-slate-200 bg-white shadow-xs cursor-pointer pointer-events-auto",
              button_next:
                "p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded-lg transition-all border border-slate-200 bg-white shadow-xs cursor-pointer pointer-events-auto",
              month_grid: "w-full border-collapse",
              weekdays: "flex justify-between w-full mb-1",
              weekday:
                "text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1 text-center w-10 block select-none",
              week: "flex w-full justify-between mt-1.5 gap-1",
              day: "h-10 w-10 text-xs font-semibold text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer relative",
              outside: "text-slate-300 pointer-events-none opacity-30",
            }}
          />
        </div>

        {/* Right Column Container: Summary Metrics Legend Information Viewport */}
        <div className="md:col-span-5 space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 self-stretch flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Log Metrics
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Quick breakdown of active entries for this tracking period.
            </p>
          </div>

          <div className="space-y-2">
            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-2.5 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                Verified Logs
              </span>
              <span className="font-mono font-bold">
                {approvedDates.length}
              </span>
            </div>
            <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-2.5 flex items-center justify-between text-xs font-semibold text-blue-800">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Pending
                Review
              </span>
              <span className="font-mono font-bold">{pendingDates.length}</span>
            </div>
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex items-center justify-between text-xs font-semibold text-amber-800">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />{" "}
                Revisions Needed
              </span>
              <span className="font-mono font-bold">{flaggedDates.length}</span>
            </div>
          </div>

          <div className="text-[10px] font-medium text-slate-400 italic bg-slate-50 p-2 rounded-lg border border-slate-100/70 select-none">
            💡 Click any colored date highlight bubble on the calendar matrix
            grid to open details.
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal Window Overlay */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 shadow-xl text-slate-700 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <CalendarIcon className="h-4 w-4 text-indigo-500" />
                {format(new Date(selectedEntry.date), "eeee, d MMMM yyyy")}
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 text-[10px] font-bold">
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                Week {selectedEntry.weekNumber}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-1 rounded-md flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3" />{" "}
                {selectedEntry.hoursWorked.toFixed(1)} hrs
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Activity Execution Summary
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line max-h-40 overflow-y-auto">
                {selectedEntry.activityDetails}
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Supervisor Authorization Metrics
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`p-2 rounded-xl border flex flex-col gap-1 text-[11px] ${
                    selectedEntry.orgApproved
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                      : "bg-amber-50/50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    Industry Mentor
                  </span>
                  <div className="flex items-center gap-1 font-semibold">
                    {selectedEntry.orgApproved ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <HelpCircle className="h-3 w-3 text-amber-500" />
                    )}
                    {selectedEntry.orgApproved ? "Verified" : "Pending Signoff"}
                  </div>
                </div>

                <div
                  className={`p-2 rounded-xl border flex flex-col gap-1 text-[11px] ${
                    selectedEntry.acadApproved
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                      : "bg-amber-50/50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                    Faculty Advisor
                  </span>
                  <div className="flex items-center gap-1 font-semibold">
                    {selectedEntry.acadApproved ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <HelpCircle className="h-3 w-3 text-amber-500" />
                    )}
                    {selectedEntry.acadApproved
                      ? "Verified"
                      : "Pending Signoff"}
                  </div>
                </div>
              </div>

              {(selectedEntry.orgFeedback || selectedEntry.acadFeedback) && (
                <div className="bg-amber-50 border border-amber-200 text-[11px] text-amber-900 rounded-xl p-3 space-y-1 mt-2">
                  <span className="font-bold text-amber-800 block">
                    Active Revision Feedback:
                  </span>
                  {selectedEntry.orgFeedback && (
                    <p>
                      • <span className="font-semibold">Mentor:</span> "
                      {selectedEntry.orgFeedback}"
                    </p>
                  )}
                  {selectedEntry.acadFeedback && (
                    <p>
                      • <span className="font-semibold">Faculty:</span> "
                      {selectedEntry.acadFeedback}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
