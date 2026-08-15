"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { useAuthStore } from "@/store/useAuthStore";

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      // error already set in store
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-foreground text-background font-bold text-lg">
              PD
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Reset password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send a reset link
            </p>
          </div>

          {sent ? (
            <div className="matte-card p-6 space-y-4 text-center">
              <p className="text-sm text-foreground">
                If an account exists for <strong>{email}</strong>, a password
                reset link has been sent.
              </p>
              <Link href="/login">
                <Button variant="secondary" className="w-full">
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="matte-card p-6 space-y-4">
              {error && (
                <div className="rounded-[var(--radius-sm)] bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Button type="submit" className="w-full" isLoading={loading}>
                Send reset link
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-foreground hover:underline">
              Back to sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </PublicRoute>
  );
}
