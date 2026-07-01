"use client";

import { useState } from "react";
import { reviewDocumentAction } from "@/app/actions/supervisor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock, // 💡 Added for better visual state indicators
} from "lucide-react";

interface SupervisorReviewZoneProps {
  students: any[];
}

export function SupervisorReviewZone({ students }: SupervisorReviewZoneProps) {
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null,
  );
  const [isMutating, setIsMutating] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>(
    {},
  );

  const requiredTasks = [
    { id: "OFFER_LETTER", label: "Corporate Internship Offer Letter" },
    { id: "INDEMNITY_LETTER", label: "University Indemnity Declaration Form" },
    { id: "MID_TERM_EVAL", label: "Mid-Term Performance Evaluation Sheet" },
    { id: "FINAL_REPORT", label: "Final Internship Technical Report" },
  ];

  const handleReview = async (
    submissionId: string,
    actionType: "APPROVE" | "REJECT",
  ) => {
    setIsMutating(submissionId);

    const payload = new FormData();
    payload.append("submissionId", submissionId);
    payload.append("actionType", actionType);
    if (actionType === "REJECT") {
      payload.append("feedback", rejectionNotes[submissionId] || "");
    }

    await reviewDocumentAction(payload);
    setIsMutating(null);
  };

  return (
    <div className="space-y-4 text-slate-700">
      {students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 font-medium text-xs">
          No students are currently assigned to your evaluation cohort matrix.
        </div>
      ) : (
        students.map((student) => {
          const submissions = student.submissions || [];

          // 💡 THE ACCURACY FIX: Metric score must only aggregate officially verified/approved file structures
          const completionPercentage = Math.round(
            (submissions.filter((s: any) => s.status === "APPROVED").length /
              4) *
              100,
          );
          const isExpanded = expandedStudentId === student.id;

          return (
            <div
              key={student.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Row Header Info Sheet Panel */}
              <div
                onClick={() =>
                  setExpandedStudentId(isExpanded ? null : student.id)
                }
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                      {student.user?.name || "Anonymous Student"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono font-semibold">
                      {student.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Compliance Metric
                    </span>
                    <span className="text-xs font-bold font-mono text-indigo-600">
                      {completionPercentage}% Approved
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Dropdown Task Workspace Container */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Milestone Credential Clearances
                  </h4>

                  <div className="grid gap-3">
                    {requiredTasks.map((task) => {
                      const submission = submissions.find(
                        (s: any) => s.taskName === task.id,
                      );

                      // Dynamic document icon coloring based on validation profile state
                      let fileIconClass = "text-slate-300";
                      if (submission?.status === "APPROVED")
                        fileIconClass = "text-emerald-500";
                      if (submission?.status === "PENDING")
                        fileIconClass = "text-amber-500";
                      if (submission?.status === "REJECTED")
                        fileIconClass = "text-red-400";

                      return (
                        <div
                          key={task.id}
                          className="bg-white border border-slate-200/60 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <FileText
                              className={`h-4 w-4 mt-0.5 shrink-0 ${fileIconClass}`}
                            />
                            <div>
                              <p className="font-bold text-slate-800 tracking-tight">
                                {task.label}
                              </p>
                              {submission ? (
                                <div className="space-y-0.5">
                                  <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-bold hover:underline mt-0.5"
                                  >
                                    <ExternalLink className="h-2.5 w-2.5" />{" "}
                                    Inspect Uploaded File Asset
                                  </a>
                                  {submission.status === "REJECTED" &&
                                    submission.feedback && (
                                      <p className="text-[10px] text-red-500 font-semibold italic block">
                                        Last Rejection Reason: "
                                        {submission.feedback}"
                                      </p>
                                    )}
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 italic mt-0.5">
                                  No document assets pushed by student yet.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Interactive Audit Verification Block */}
                          <div className="shrink-0 flex items-center gap-2">
                            {submission ? (
                              submission.status === "APPROVED" ? (
                                /* 🟢 CASE A: DOCUMENT ALREADY VERIFIED AND LOCKED */
                                <div className="flex items-center gap-2">
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 select-none">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                                    Approved
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={isMutating === submission.id}
                                    onClick={() =>
                                      handleReview(submission.id, "REJECT")
                                    }
                                    className="h-7 text-[10px] text-slate-400 hover:text-amber-600 rounded-lg font-bold cursor-pointer"
                                  >
                                    Revoke
                                  </Button>
                                </div>
                              ) : (
                                /* 🟡 CASE B: DOCUMENT PENDING EVALUATION AUDITS */
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  {submission.status === "PENDING" ? (
                                    <span className="bg-amber-50 border border-amber-200/60 text-amber-700 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg flex items-center gap-1 select-none animate-pulse">
                                      <Clock className="h-3 w-3 text-amber-500" />{" "}
                                      New Submission
                                    </span>
                                  ) : (
                                    <span className="bg-red-50 border border-red-200/60 text-red-700 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg flex items-center gap-1 select-none">
                                      <AlertTriangle className="h-3 w-3 text-red-500" />{" "}
                                      Rejected Entry
                                    </span>
                                  )}

                                  <Input
                                    placeholder="Add revision review feedback..."
                                    value={rejectionNotes[submission.id] || ""}
                                    onChange={(e) =>
                                      setRejectionNotes((prev) => ({
                                        ...prev,
                                        [submission.id]: e.target.value,
                                      }))
                                    }
                                    className="h-7 text-[10px] max-w-xs rounded-lg border-slate-200"
                                  />
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      disabled={isMutating === submission.id}
                                      onClick={() =>
                                        handleReview(submission.id, "APPROVE")
                                      }
                                      className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] px-2.5 cursor-pointer flex items-center gap-1"
                                    >
                                      {isMutating === submission.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        "Verify"
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      disabled={isMutating === submission.id}
                                      onClick={() =>
                                        handleReview(submission.id, "REJECT")
                                      }
                                      className="h-7 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg text-[10px] px-2.5 border border-red-200 cursor-pointer"
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              )
                            ) : (
                              /* ⚪ CASE C: BASELINE AWAITING STUDENT ACTIONS */
                              <span className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-lg border border-slate-200/40 select-none">
                                Awaiting Action
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
