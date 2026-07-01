"use client";

import { useState } from "react";
import { LogbookCalendar } from "@/components/dashboard/logbook-calendar";
import { LogbookCard } from "@/components/dashboard/logbook-card";
import { List, CalendarDays, ClipboardList } from "lucide-react";

interface LogbookCalendarViewSwitchProps {
  entries: any[];
}

export function LogbookCalendarViewSwitch({
  entries,
}: LogbookCalendarViewSwitchProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  return (
    <div className="space-y-6">
      {/* 🧭 Segmented View Selection Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-800">
            System Operational History
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor and correct industrial log records via status matrix grid or
            timeline viewports.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-500 self-start sm:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "calendar"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "hover:text-slate-700 hover:bg-white/40"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
            Calendar Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "hover:text-slate-700 hover:bg-white/40"
            }`}
          >
            <List className="h-3.5 w-3.5 text-indigo-500" />
            List Stream
          </button>
        </div>
      </div>

      {/* 🔄 Dynamic View Rendering Core Engine */}
      <div className="animate-fade-in">
        {viewMode === "calendar" ? (
          <LogbookCalendar entries={entries} />
        ) : (
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center text-slate-500 backdrop-blur-sm">
                <div className="flex justify-center mb-3">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                </div>
                <p className="font-bold text-sm text-slate-700">
                  No Historical Streams Committed
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Use the left entry manager widget to build your initial day
                  records.
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <LogbookCard key={entry.id} entry={entry} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
