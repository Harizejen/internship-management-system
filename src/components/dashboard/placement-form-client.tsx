"use client";

import { useState } from "react";
import { updatePlacementDetailsAction } from "@/app/actions/placement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Building2,
  Calendar,
  UserCheck,
  Mail,
  CheckCircle,
} from "lucide-react";

interface FormProps {
  initialData: {
    organizationName: string;
    startDate: string;
    endDate: string;
    mentorName: string;
    mentorEmail: string;
    status: string;
  };
}

export function PlacementFormClient({ initialData }: FormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const result = await updatePlacementDetailsAction(formData);

    setIsLoading(false);
    if (result?.error) {
      setFeedback({ type: "error", message: result.error });
    } else {
      setFeedback({
        type: "success",
        message:
          "Placement credentials synced and supervisor profile provisioned successfully!",
      });
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {feedback && (
        <div
          className={`rounded-xl p-3 text-xs font-semibold border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          } animate-scale-in`}
        >
          {feedback.message}
        </div>
      )}

      {/* BLOCK A: CORPORATE PROFILE DETAILS */}
      <div className="space-y-3">
        <div className="border-b border-slate-100 pb-1 flex items-center gap-1.5 text-slate-800">
          <Building2 className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-bold tracking-tight">
            Company Station Parameters
          </h3>
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="organizationName"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
          >
            Host Organization Name
          </Label>
          <Input
            id="organizationName"
            name="organizationName"
            defaultValue={initialData.organizationName}
            required
            placeholder="e.g., Petroliam Nasional Berhad (PETRONAS) or Google Malaysia"
            className="h-10 text-xs border-slate-200 rounded-xl"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label
              htmlFor="startDate"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
            >
              Placement Start Date
            </Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={initialData.startDate}
              required
              className="h-10 text-xs border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="endDate"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
            >
              Placement Conclusion Date
            </Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={initialData.endDate}
              required
              className="h-10 text-xs border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* BLOCK B: SUPERVISOR INFORMATION DEPLOYMENT */}
      <div className="space-y-3 pt-2">
        <div className="border-b border-slate-100 pb-1 flex items-center gap-1.5 text-slate-800">
          <UserCheck className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-bold tracking-tight">
            On-site Industry Mentor Credentials
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label
              htmlFor="mentorName"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
            >
              Mentor Full Name
            </Label>
            <Input
              id="mentorName"
              name="mentorName"
              defaultValue={initialData.mentorName}
              required
              placeholder="e.g., Encik Irwan Shah"
              className="h-10 text-xs border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="mentorEmail"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
            >
              Official Corporate Email
            </Label>
            <Input
              id="mentorEmail"
              name="mentorEmail"
              type="email"
              defaultValue={initialData.mentorEmail}
              required
              placeholder="e.g., irwan@corporate.com"
              className="h-10 text-xs border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors mt-2"
      >
        {isLoading ? (
          <span className="flex items-center gap-1 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Syncing Deployment
            Data...
          </span>
        ) : (
          "Commit Changes & Provision Supervisor Access"
        )}
      </Button>
    </form>
  );
}
