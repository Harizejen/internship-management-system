"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { signIn } from "next-auth/react"; // 💡 Import client-side signIn hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"credentials" | "magic-link">(
    "credentials",
  );
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // =========================================================================
  // HANDLER A: UNIVERSITY ID LOGIN (Students & Academic Lecturers)
  // =========================================================================
  async function handleCredentialsSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  // =========================================================================
  // HANDLER B: PASSWORDLESS MAGIC LINK (Industry Supervisors)
  // =========================================================================
  async function handleMagicLinkSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      setError("Please provide a valid email address.");
      setIsLoading(false);
      return;
    }

    // Direct invocation to Resend engine inside Auth.js setup
    const result = await signIn("resend", {
      email,
      redirect: false, // Prevents full page refresh so we can show success box
      callbackUrl: "/dashboard",
    });

    setIsLoading(false);
    if (result?.error) {
      setError(
        "Failed to send login token. Please verify connectivity configuration.",
      );
    } else {
      setMagicLinkSent(true);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl">
      {/* Upper Brand Info Block */}
      <div className="space-y-1 text-center pb-4">
        <div className="flex justify-center pb-2">
          <div className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md border border-white/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          IMS Gateway Login
        </h1>
        <p className="text-white/70 text-xs">
          Select your authorization pipeline to enter the system terminal.
        </p>
      </div>

      {/* 💡 MODERN SEGMENTED GLASS TOGGLE TABS (Saves vertical space) */}
      <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 mb-4 text-xs font-semibold">
        <button
          type="button"
          disabled={isLoading || magicLinkSent}
          onClick={() => {
            setActiveTab("credentials");
            setError(null);
          }}
          className={`py-2 rounded-lg transition-all duration-150 ${
            activeTab === "credentials"
              ? "bg-white text-slate-950 shadow-xs font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          Student / Staff
        </button>
        <button
          type="button"
          disabled={isLoading || magicLinkSent}
          onClick={() => {
            setActiveTab("magic-link");
            setError(null);
          }}
          className={`py-2 rounded-lg transition-all duration-150 ${
            activeTab === "magic-link"
              ? "bg-white text-slate-950 shadow-xs font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          Industry Supervisor
        </button>
      </div>

      {/* Dynamic Error Messaging Output */}
      {error && (
        <div className="mb-4 rounded-md bg-red-500/20 border border-red-500/30 p-3 text-xs font-medium text-red-200 backdrop-blur-md animate-scale-in">
          {error}
        </div>
      )}

      {/* =========================================================================
          VIEW PANEL A: CREDENTIALS SUBMISSION FORM
         ========================================================================= */}
      {activeTab === "credentials" && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="identifier"
              className="text-white/90 font-medium text-sm"
            >
              Identifier
            </Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="e.g., 2026123456 or lecturer_staff_id"
              required
              disabled={isLoading}
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30 focus-visible:border-white/30 backdrop-blur-md transition-all rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-white/90 font-medium text-sm"
            >
              Security Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30 focus-visible:border-white/30 backdrop-blur-md transition-all rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-white text-slate-950 font-bold hover:bg-white/90 shadow-md transition-all disabled:bg-white/50 disabled:text-slate-800 mt-2 rounded-xl text-xs"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                Credentials...
              </div>
            ) : (
              "Sign In with Portal ID"
            )}
          </Button>
        </form>
      )}

      {/* =========================================================================
          VIEW PANEL B: PASSWORDLESS MAGIC LINK SUBMISSION FORM
         ========================================================================= */}
      {activeTab === "magic-link" && (
        <div className="animate-fade-in">
          {magicLinkSent ? (
            /* Magic Link Dispatched Success Banner UX */
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center space-y-2 backdrop-blur-md">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-emerald-200">
                Secure Access Token Sent!
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                We have dispatched a secure login token link directly to your
                corporate inbox. Click it to log in instantly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white/90 font-medium text-sm"
                >
                  Corporate Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mentor@company.com"
                  required
                  disabled={isLoading}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30 focus-visible:border-white/30 backdrop-blur-md transition-all rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-md transition-all disabled:bg-indigo-600/50 mt-2 rounded-xl text-xs border border-indigo-400/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Dispatching
                    Link Token...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" /> Send Passwordless Magic Link
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
