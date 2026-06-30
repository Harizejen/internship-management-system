"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

  return (
    <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      <div className="space-y-1 text-center pb-6">
        <div className="flex justify-center pb-2">
          <div className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md border border-white/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          IMS Gateway Login
        </h1>
        <p className="text-white/70 text-sm">
          Enter your Student ID / Email to access your portal space.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-500/20 border border-red-500/30 p-3 text-sm font-medium text-red-200 backdrop-blur-md">
            {error}
          </div>
        )}

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
            placeholder="e.g., 2024123456 or name@student.uitm.edu.my"
            required
            disabled={isLoading}
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30 focus-visible:border-white/30 backdrop-blur-md transition-all"
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
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30 focus-visible:border-white/30 backdrop-blur-md transition-all"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-white text-slate-950 font-semibold hover:bg-white/90 shadow-md transition-all disabled:bg-white/50 disabled:text-slate-800 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying Credentials...
            </>
          ) : (
            "Sign In to System"
          )}
        </Button>
      </form>
    </div>
  );
}
