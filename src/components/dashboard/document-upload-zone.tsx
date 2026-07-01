"use client";

import { useState, useEffect } from "react";
import {
  submitDocumentAction,
  deleteDocumentAction,
} from "@/app/actions/documents";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Trash2,
} from "lucide-react";

import "@uploadcare/react-uploader/core.css";

interface UploadZoneProps {
  existingSubmissions: any[];
}

export function DocumentUploadZone({ existingSubmissions }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [stagedUrls, setStagedUrls] = useState<Record<string, string>>({});

  // 💡 HYDRATION SHIELD: Tracks whether the component has completely mounted onto browser DOM
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const requiredTasks = [
    { id: "OFFER_LETTER", label: "Official Corporate Internship Offer Letter" },
    {
      id: "INDEMNITY_LETTER",
      label: "Signed University Indemnity Declaration Form",
    },
    { id: "MID_TERM_EVAL", label: "Mid-Term Performance Evaluation Sheet" },
    {
      id: "FINAL_REPORT",
      label: "Final Internship Practical Technical Report",
    },
  ];

  const handleUploadChange = (event: any, taskId: string) => {
    const successfulFile = event.allEntries.find(
      (file: any) => file.status === "success",
    );
    if (successfulFile && successfulFile.cdnUrl) {
      setStagedUrls((prev) => ({ ...prev, [taskId]: successfulFile.cdnUrl }));
    } else {
      setStagedUrls((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    }
  };

  const handleModalClose = async (taskId: string) => {
    const finalCdnUrl = stagedUrls[taskId];
    if (finalCdnUrl) {
      setIsProcessing(taskId);
      setError(null);

      const serverPayload = new FormData();
      serverPayload.append("taskName", taskId);
      serverPayload.append("fileUrl", finalCdnUrl);

      const result = await submitDocumentAction(serverPayload);

      setIsProcessing(null);
      if (result?.error) {
        setError(result.error);
      } else {
        setStagedUrls((prev) => {
          const updated = { ...prev };
          delete updated[taskId];
          return updated;
        });
      }
    }
  };

  // 💡 DELETE CONTEXT PROCESSOR: Communicates with deleteDocumentAction pipeline
  const handleDeleteSubmission = async (taskId: string) => {
    if (!confirm("Are you sure you want to remove this document submission?"))
      return;

    setIsProcessing(taskId);
    setError(null);

    const deletePayload = new FormData();
    deletePayload.append("taskName", taskId);

    const result = await deleteDocumentAction(deletePayload);
    setIsProcessing(null);

    if (result?.error) {
      setError(result.error);
    }
  };

  // 💡 If the app is server-rendering, display a safe layout placeholder grid skeleton
  if (!mounted) {
    return (
      <div className="grid gap-4 opacity-40">
        {requiredTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-slate-700">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {requiredTasks.map((task) => {
          const submission = existingSubmissions.find(
            (s) => s.taskName === task.id,
          );
          const isCurrentLoading = isProcessing === task.id;

          return (
            <div
              key={task.id}
              className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                submission
                  ? "bg-emerald-50/20 border-emerald-200/60"
                  : "bg-white border-slate-200/80 hover:border-slate-300"
              } ${isCurrentLoading ? "opacity-60 pointer-events-none" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    submission
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                    {task.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Requirement ID: {task.id}
                  </p>

                  {submission && (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-bold mt-1.5 underline underline-offset-2"
                    >
                      <ExternalLink className="h-3 w-3" /> View Verified Cloud
                      Asset
                    </a>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {isCurrentLoading ? (
                  <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                    Synchronizing...
                  </div>
                ) : submission ? (
                  // 💡 INTERACTIVE RE-DESIGN: Show confirmation alongside an functional delete engine
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-xl flex items-center gap-1.5 select-none">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Verified Submitted
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteSubmission(task.id)}
                      className="h-8 w-8 rounded-xl border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                      title="Remove Document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="uploadcare-wrapper text-xs font-bold">
                    <FileUploaderRegular
                      pubkey={
                        process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ""
                      }
                      maxLocalFileSizeBytes={10485760}
                      multiple={false}
                      imgOnly={false}
                      sourceList="local, url, google-drive, dropbox, onedrive"
                      onChange={(e) => handleUploadChange(e, task.id)}
                      onModalClose={() => handleModalClose(task.id)}
                      className="uc-light ims-uploader"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
