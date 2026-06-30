"use client";

import { useState } from "react";
import { reviewLogbookEntryAction } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
} from "lucide-react";

interface ReviewCardProps {
  entry: any;
  currentRole: string;
}

export function ReviewCard({ entry, currentRole }: ReviewCardProps) {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerification(actionType: "APPROVE" | "REJECT") {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("entryId", entry.id);
    formData.append("feedback", feedback);
    formData.append("actionType", actionType);

    const result = await reviewLogbookEntryAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  return (
    <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left Section: Student details and activity content */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md dark:bg-indigo-950/40 dark:text-indigo-400">
              <User className="h-3.5 w-3.5" />
              {entry.student?.user?.name || "Unknown Student"}
            </div>
            <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md dark:bg-slate-800 dark:text-slate-300">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              {new Date(entry.date).toLocaleDateString("en-MY", {
                dateStyle: "medium",
              })}
            </div>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md dark:bg-slate-800 dark:text-slate-300 font-mono">
              Week {entry.weekNumber}
            </span>
            <span className="bg-emerald-50/70 text-emerald-700 px-2.5 py-1 rounded-md dark:bg-emerald-950/30 dark:text-emerald-400 font-mono flex items-center gap-1">
              <Clock className="h-3 w-3" /> {entry.hoursWorked.toFixed(1)} hrs
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800/30 dark:border-slate-800">
            {entry.activityDetails}
          </p>
        </div>

        {/* Right Section: Interactive Action Panel */}
        <div className="w-full md:w-64 space-y-3">
          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <Textarea
            placeholder="Add official correction notes or verification feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
            disabled={isLoading}
            className="text-xs bg-slate-50/50 resize-none border-slate-200 focus-visible:ring-indigo-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => handleVerification("REJECT")}
              className="h-9 text-xs border-slate-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Flag Issue
            </Button>
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => handleVerification("APPROVE")}
              className="h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Sign Off
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
