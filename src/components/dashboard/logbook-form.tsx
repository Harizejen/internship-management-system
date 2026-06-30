"use client";

import { useState, useRef } from "react";
import { createLogbookEntryAction } from "@/app/actions/logbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";

export function LogbookForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createLogbookEntryAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      formRef.current?.reset();
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Log Today's Progress
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Commit your metrics directly to the supervisor verification queue.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 text-red-700 border border-red-200/60 p-3 text-xs font-semibold dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label
            htmlFor="date"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Date of Work
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
            className="h-10 border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="weekNumber"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
            >
              Week Number
            </Label>
            <Input
              id="weekNumber"
              name="weekNumber"
              type="number"
              min="1"
              max="24"
              placeholder="e.g., 1"
              required
              className="h-10 border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="hoursWorked"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
            >
              Hours Worked
            </Label>
            <Input
              id="hoursWorked"
              name="hoursWorked"
              type="number"
              step="0.5"
              min="1"
              max="24"
              placeholder="e.g., 8"
              required
              className="h-10 border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="activityDetails"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Summary of Daily Tasks
          </Label>
          <Textarea
            id="activityDetails"
            name="activityDetails"
            placeholder="Detail out software bugs patched, system layout additions, or documentation compiled..."
            rows={5}
            required
            className="border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 text-sm resize-none leading-relaxed"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold transition-colors mt-2 rounded-xl text-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Entry...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Commit Log Entry
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
