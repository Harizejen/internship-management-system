"use client";

import { useState } from "react";
import { correctLogbookEntryAction } from "@/app/actions/logbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  PencilRuler,
  X,
  Loader2,
} from "lucide-react";

interface LogbookCardProps {
  entry: {
    id: string;
    date: Date | string;
    weekNumber: number;
    hoursWorked: number;
    activityDetails: string;
    orgApproved: boolean;
    acadApproved: boolean;
    orgFeedback?: string | null;
    acadFeedback?: string | null;
  };
}

export function LogbookCard({ entry }: LogbookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFeedback = entry.orgFeedback || entry.acadFeedback;

  async function handleUpdateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("entryId", entry.id);

    const result = await correctLogbookEntryAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-2xl border-2 border-indigo-500 bg-white p-5 shadow-md space-y-4 text-slate-700 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <PencilRuler className="h-4 w-4 text-indigo-500" />
            Correcting Logbook Entry
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-3 space-y-1.5">
              <Label
                htmlFor="activityDetails"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Task / Activity Description
              </Label>
              <Textarea
                id="activityDetails"
                name="activityDetails"
                defaultValue={entry.activityDetails}
                required
                rows={3}
                className="text-xs border-slate-200 focus-visible:ring-indigo-500 rounded-xl resize-none bg-white text-slate-800"
              />
            </div>
            <div className="sm:col-span-1 space-y-1.5">
              <Label
                htmlFor="hoursWorked"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Hours Worked
              </Label>
              <Input
                id="hoursWorked"
                name="hoursWorked"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                defaultValue={entry.hoursWorked}
                required
                className="h-10 text-xs border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="h-9 rounded-xl text-xs font-semibold px-4 border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Resubmit Entry"
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-2xl border p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col gap-4 overflow-hidden ${
        hasFeedback
          ? "bg-amber-50/30 border-amber-300/70 hover:border-amber-400"
          : "bg-white border-slate-200/80 hover:border-indigo-500/20"
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity ${
          hasFeedback
            ? "bg-amber-500 opacity-100"
            : "bg-linear-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100"
        }`}
      />

      {hasFeedback && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 space-y-1 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Revision Requested
          </div>
          {entry.orgFeedback && (
            <p className="text-amber-900">
              <span className="font-semibold">Industry Mentor:</span> "
              {entry.orgFeedback}"
            </p>
          )}
          {entry.acadFeedback && (
            <p className="text-amber-900">
              <span className="font-semibold">Faculty Lecturer:</span> "
              {entry.acadFeedback}"
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
              {new Date(entry.date).toLocaleDateString("en-MY", {
                dateStyle: "medium",
              })}
            </div>
            <span className="bg-indigo-50/70 text-indigo-700 px-2.5 py-1 rounded-md">
              Week {entry.weekNumber}
            </span>
            <span className="bg-emerald-50/70 text-emerald-700 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
              <Clock className="h-3 w-3" /> {entry.hoursWorked.toFixed(1)} hrs
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line pl-0.5">
            {entry.activityDetails}
          </p>
        </div>

        <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 justify-between sm:justify-start shrink-0">
          <div className="flex sm:flex-col gap-2">
            <div
              className={`text-[11px] font-bold tracking-wide uppercase rounded-md px-2.5 py-1 flex items-center gap-1.5 border ${
                entry.orgApproved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                  : "bg-amber-50 text-amber-700 border-amber-200/50"
              }`}
            >
              {entry.orgApproved ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              ) : (
                <HelpCircle className="h-3 w-3 text-amber-500" />
              )}
              <span>Host: {entry.orgApproved ? "Verified" : "Pending"}</span>
            </div>

            <div
              className={`text-[11px] font-bold tracking-wide uppercase rounded-md px-2.5 py-1 flex items-center gap-1.5 border ${
                entry.acadApproved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                  : "bg-amber-50 text-amber-700 border-amber-200/50"
              }`}
            >
              {entry.acadApproved ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              ) : (
                <HelpCircle className="h-3 w-3 text-amber-500" />
              )}
              <span>
                Faculty: {entry.acadApproved ? "Verified" : "Pending"}
              </span>
            </div>
          </div>

          {hasFeedback && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-8 rounded-xl text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 mt-1 shadow-xs transition-all w-full sm:w-auto"
            >
              Fix Activity Log
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
