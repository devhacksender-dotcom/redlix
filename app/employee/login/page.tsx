"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft, Download, X, Smartphone } from "lucide-react";

// BeforeInstallPromptEvent is not in the standard TS types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function EmployeeLogin() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ── PWA Install state ────────────────────────────────────────────────────
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installOutcome, setInstallOutcome] = useState<"accepted" | "dismissed" | null>(null);

  useEffect(() => {
    // Check if already installed (running as standalone PWA)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed banner this session
    const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Slight delay so page settles first
      setTimeout(() => setShowInstallBanner(true), 1200);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallOutcome(outcome);
    setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/employee");
      } else {
        setError(data.message || "Invalid email or password");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  // ── Forgot password ──────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/employee/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message || "Password reset link has been sent to your email.");
        setLoading(false);
      } else {
        setError(data.message || "Failed to request password reset.");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">

      {/* ── PWA Install Banner ─────────────────────────────────────────── */}
      {showInstallBanner && !isInstalled && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500"
          role="dialog"
          aria-label="Install Redlix Employee App"
        >
          <div className="bg-[#111111] border-t border-white/10 px-5 py-4 flex items-center gap-4 shadow-2xl">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icon-192.png" alt="Redlix Portal" className="w-full h-full object-cover" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">Add to Home Screen</p>
              <p className="text-xs text-white/40 mt-0.5 leading-snug">
                Install the Redlix Employee Portal for quick access
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 bg-[#E61E32] hover:bg-[#ff1f34] text-white text-xs font-semibold px-4 py-2.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </button>
              <button
                onClick={handleDismissBanner}
                className="text-white/30 hover:text-white/70 p-2 transition-colors"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Install success nudge ──────────────────────────────────────── */}
      {installOutcome === "accepted" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/10 border border-green-500/20 px-5 py-3 flex items-center gap-2 animate-in fade-in duration-300">
          <Smartphone className="w-4 h-4 text-green-400" />
          <p className="text-xs text-green-400 font-medium">App installed — find it on your home screen!</p>
        </div>
      )}

      {/* ── Main login card ────────────────────────────────────────────── */}
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10 text-center">
          {/* PWA install hint for iOS (no beforeinstallprompt support) */}
          {!isInstalled && !installPrompt && (
            <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <Smartphone className="w-3 h-3 text-[#E61E32]" />
              <span className="text-[10px] text-white/40 font-medium">
                On iPhone? Tap Share → Add to Home Screen
              </span>
            </div>
          )}

          <h1 className="text-2xl font-bold text-white mb-2">
            {view === "login" ? "Employee Login" : "Reset Password"}
          </h1>
          <p className="text-sm text-white/40">
            {view === "login"
              ? "Enter your credentials to access the portal"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {view === "login" ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@redlix.com"
                  className="w-full bg-[#111111] border border-white/10 px-12 py-3.5 text-sm text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView("forgot");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-xs text-[#E61E32] hover:text-[#ff1f34] font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-white/10 px-12 py-3.5 text-sm text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-3">
                <p className="text-xs text-[#E61E32] text-center font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-50 py-3.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <span className="text-sm font-bold uppercase tracking-widest text-white">Login</span>
              )}
            </button>

            <p className="text-center text-[10px] text-white/10 uppercase tracking-widest">
              Redlix Studio Employee Terminal
            </p>
          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@redlix.com"
                  className="w-full bg-[#111111] border border-white/10 px-12 py-3.5 text-sm text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-3">
                <p className="text-xs text-[#E61E32] text-center font-medium">{error}</p>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 p-3">
                <p className="text-xs text-green-500 text-center font-medium">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-50 py-3.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <span className="text-sm font-bold uppercase tracking-widest text-white">
                  Send Reset Link
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setView("login");
                setError("");
                setSuccessMessage("");
              }}
              className="w-full flex items-center justify-center gap-2 text-xs text-white/50 hover:text-white transition-colors py-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
