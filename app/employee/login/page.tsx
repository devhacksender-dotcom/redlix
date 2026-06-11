"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft, Download, X, Smartphone } from "lucide-react";

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

  // ── PWA Install ──────────────────────────────────────────────────────────
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    }
    return false;
  });
  const [installOutcome, setInstallOutcome] = useState<"accepted" | "dismissed" | null>(null);

  useEffect(() => {
    if (isInstalled) return;
    const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowInstallBanner(true), 1500);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isInstalled]);

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
      const isPWA = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      const res = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isPWA }),
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
    <main className="min-h-dvh bg-[#0a0a0a] flex flex-col relative overflow-hidden">

      {/* ── Install success toast ────────────────────────────────────────── */}
      {installOutcome === "accepted" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/10 border border-green-500/20 px-5 py-3 flex items-center gap-2 animate-in fade-in duration-300">
          <Smartphone className="w-4 h-4 text-green-400 shrink-0" />
          <p className="text-xs text-green-400 font-medium">App installed — find it on your home screen!</p>
        </div>
      )}

      {/* ── Full-height split grid ───────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT: Image panel ─────────────────────────────────────────── */}
        <div className="relative hidden lg:block overflow-hidden border-r border-white/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.magnific.com/free-photo/authentic-small-youthful-marketing-agency_23-2150167428.jpg?semt=ais_hybrid&w=740&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle dark overlay so image doesn't overwhelm */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* ── RIGHT: Form panel ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:min-h-0 justify-between overflow-y-auto">

          {/* Mobile-only top bar */}
          <div className="flex lg:hidden items-center justify-between px-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pb-4 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
              alt="Redlix"
              className="h-6 w-auto brightness-0 invert opacity-95"
            />
            {!isInstalled && !installPrompt && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Smartphone className="w-3 h-3 text-[#E61E32]" />
                <span className="text-[10px] text-white/40">Share → Add to Home</span>
              </div>
            )}
          </div>

          {/* Centred form */}
          <div className="flex-1 flex items-center justify-center px-6 py-8 sm:py-12 lg:py-0">
            <div className="w-full max-w-sm">

              {/* Logo (Visible on desktop/tablet, hidden on mobile since mobile top bar has it) */}
              <div className="hidden lg:block mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                  alt="Redlix"
                  className="h-8 w-auto brightness-0 invert opacity-95"
                />
              </div>

              {/* Form header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1.5">
                  {view === "login" ? "Sign in" : "Reset password"}
                </h1>
                <p className="text-sm text-white/40">
                  {view === "login"
                    ? "Enter your credentials to access the portal"
                    : "We'll send a reset link to your email"}
                </p>
              </div>

              {/* Divider accent */}
              <div className="w-8 h-[2px] bg-[#E61E32] mb-8" />

              {view === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@redlix.com"
                        className="w-full bg-white/[0.03] border border-white/10 px-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E61E32] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-white/50">Password</label>
                      <button
                        type="button"
                        onClick={() => { setView("forgot"); setError(""); setSuccessMessage(""); }}
                        className="text-xs text-[#E61E32] hover:text-[#ff1f34] font-medium transition-colors cursor-pointer"
                      >
                        Forgot password?
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
                        className="w-full bg-white/[0.03] border border-white/10 px-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E61E32] transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 px-4 py-3">
                      <p className="text-xs text-[#E61E32] font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-40 disabled:cursor-not-allowed py-3.5 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : "Sign in to portal"}
                  </button>

                  <p className="text-center text-[10px] text-white/10 pt-2">
                    Redlix Studio · Employee Terminal
                  </p>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@redlix.com"
                        className="w-full bg-white/[0.03] border border-white/10 px-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E61E32] transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 px-4 py-3">
                      <p className="text-xs text-[#E61E32] font-medium">{error}</p>
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/20 px-4 py-3">
                      <p className="text-xs text-green-400 font-medium">{successMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-40 disabled:cursor-not-allowed py-3.5 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : "Send reset link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setView("login"); setError(""); setSuccessMessage(""); }}
                    className="w-full flex items-center justify-center gap-2 text-xs text-white/40 hover:text-white transition-colors py-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right panel bottom bar */}
          <div className="px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-white/[0.06] flex items-center justify-between shrink-0">
            <p className="text-[11px] text-white/20">© 2026 Redlix Studio</p>
            <div className="flex items-center gap-4 text-[11px] text-white/20">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PWA Install Banner — fixed bottom, full width ────────────────── */}
      {showInstallBanner && !isInstalled && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500"
          role="dialog"
          aria-label="Install Redlix Employee App"
        >
          <div className="bg-[#111111] border-t border-white/10 px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex items-center gap-4 shadow-2xl">
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://ik.imagekit.io/dypkhqxip/logo__1_" alt="Redlix Portal" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">Add to Home Screen</p>
              <p className="text-xs text-white/40 mt-0.5">Install the Redlix Employee Portal app</p>
            </div>
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
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
