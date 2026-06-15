"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft, Download, X, Smartphone, ShieldAlert } from "lucide-react";

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

    // Social Login States
    const [socialModal, setSocialModal] = useState<"none" | "google" | "apple">("none");
    const [socialEmail, setSocialEmail] = useState("");
    const [socialChecking, setSocialChecking] = useState(false);
    const [socialStatus, setSocialStatus] = useState<"input" | "error">("input");

    const handleSocialLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!socialEmail) return;
        setSocialChecking(true);
        try {
            const res = await fetch("/api/employee/social-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: socialEmail }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                router.push("/employee");
            } else {
                setSocialStatus("error");
            }
        } catch {
            setSocialStatus("error");
        } finally {
            setSocialChecking(false);
        }
    };

    // PWA Install logic
    const [deviceType, setDeviceType] = useState<"android" | "ios" | "other">("other");
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
        if (typeof window !== "undefined") {
            const ua = window.navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                setDeviceType("ios");
            } else if (/android/.test(ua)) {
                setDeviceType("android");
            } else {
                setDeviceType("other");
            }
        }
    }, []);

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
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Install success toast */}
            {installOutcome === "accepted" && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/10 border border-green-500/20 px-5 py-3 flex items-center gap-2 animate-in fade-in duration-300">
                    <Smartphone className="w-4 h-4 text-green-400 shrink-0" />
                    <p className="text-xs text-green-400 font-medium">App installed — find it on your home screen!</p>
                </div>
            )}

            <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5 bg-[#0f0f0f]">
                {/* Background layout blur effects */}
                <div className="w-[12rem] h-[12rem] bg-[#E61E32]/10 absolute z-0 rounded-full bottom-0 left-0 blur-3xl pointer-events-none"></div>

                {/* Left Panel: Branding & Slogan & Background Image */}
                <div className="bg-[#070809] text-white p-6 md:p-10 md:w-1/2 relative overflow-hidden flex flex-col justify-between min-h-[360px] md:min-h-[520px]">
                    {/* Background Image filling the container */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        <img
                            src="/login-branding-image.png"
                            alt="Redlix Employees"
                            className="w-full h-full object-cover opacity-35"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/90"></div>
                    </div>

                    {/* Logo */}
                    <div className="relative z-10 flex items-center">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                            alt="Redlix Logo"
                            className="h-[34px] w-auto object-contain"
                            style={{ filter: "brightness(0) saturate(100%) invert(24%) sepia(74%) saturate(6689%) hue-rotate(345deg) brightness(94%) contrast(93%)" }}
                        />
                    </div>

                    {/* Headline */}
                    <div className="relative z-10">
                        <h1 className="text-xs md:text-sm font-medium leading-relaxed tracking-normal text-white/70">
                            Connecting our <span className="text-[#E61E32]">global team</span> <br />
                            to build <span className="text-[#E61E32]">sleek IT solutions</span>.
                        </h1>
                    </div>
                </div>

                {/* Right Panel: Content Form */}
                <div className="p-6 md:p-10 md:w-1/2 flex flex-col justify-center bg-[#111111] z-10 text-white relative border-t md:border-t-0 md:border-l border-white/5">
                    <div className="flex flex-col items-left mb-4 text-left">
                        <h2 className="text-lg md:text-xl font-semibold mb-1 tracking-tight text-white">
                            {view === "login" ? "Get Started" : "Reset Password"}
                        </h2>
                        <p className="text-left text-[11px] text-white/40 leading-relaxed">
                            {view === "login"
                                ? "Welcome to Redlix Studio — Let's get started"
                                : "Enter your email to receive a password reset link"}
                        </p>
                    </div>

                    {view === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-white/50 text-left block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@redlix.com"
                                        className="w-full bg-[#151515] border border-white/10 px-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-white/50 text-left block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#151515] border border-white/10 px-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-2.5">
                                    <p className="text-[11px] text-[#E61E32] text-center font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-50 py-2.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                ) : (
                                    <span className="text-xs font-semibold uppercase tracking-wider text-white">Login</span>
                                )}
                            </button>

                            <div className="relative flex py-1.5 items-center">
                                <div className="flex-grow border-t border-white/5"></div>
                                <span className="flex-shrink mx-3 text-[9px] text-white/20 uppercase tracking-widest font-mono">or continue with</span>
                                <div className="flex-grow border-t border-white/5"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setSocialModal("google"); setSocialEmail(""); setSocialStatus("input"); }}
                                    className="flex items-center justify-center gap-2 border border-white/10 bg-[#151515] hover:bg-[#1d1d1d] hover:border-white/20 transition-all py-2 cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15.01 1 12 1 7.24 1 3.23 3.65 1.12 7.54l3.85 2.99C5.9 7.42 8.7 5.04 12 5.04z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.52z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.87 14.53A6.98 6.98 0 015.5 12c0-.88.16-1.73.44-2.52L2.09 6.49A11.94 11.94 0 001 12c0 2.05.52 4.02 1.44 5.76l3.43-3.23z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.1.74-2.51 1.18-4.3 1.18-3.3 0-6.1-2.38-7.03-5.49L1.12 15.93C3.23 19.82 7.24 23 12 23z"
                                        />
                                    </svg>
                                    <span className="text-[11px] font-medium text-white">Login with Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSocialModal("apple"); setSocialEmail(""); setSocialStatus("input"); }}
                                    className="flex items-center justify-center gap-2 border border-white/10 bg-[#151515] hover:bg-[#1d1d1d] hover:border-white/20 transition-all py-2 cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 16 16">
                                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                                    </svg>
                                    <span className="text-[11px] font-medium text-white">Login with Apple</span>
                                </button>
                            </div>

                            <div className="flex justify-between items-center pt-1.5">
                                <button
                                    type="button"
                                    onClick={() => { setView("forgot"); setError(""); setSuccessMessage(""); }}
                                    className="text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/")}
                                    className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to Home
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-white/50 text-left block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@redlix.com"
                                        className="w-full bg-[#151515] border border-white/10 px-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-2.5">
                                    <p className="text-[11px] text-[#E61E32] text-center font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-500/10 border border-green-500/20 p-2.5">
                                    <p className="text-[11px] text-green-400 text-center font-medium">
                                        {successMessage}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-50 py-2.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                ) : (
                                    <span className="text-xs font-semibold uppercase tracking-wider text-white">Send Reset Link</span>
                                )}
                            </button>

                            <div className="flex justify-between items-center pt-1.5">
                                <button
                                    type="button"
                                    onClick={() => { setView("login"); setError(""); setSuccessMessage(""); }}
                                    className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* PWA Install Banner */}
            {showInstallBanner && !isInstalled && (
                <div
                    className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500"
                    role="dialog"
                    aria-label="Install Redlix Employee App"
                >
                    <div className="bg-[#0a0a0a] border-t border-white/5 px-6 py-3.5 flex items-center justify-between gap-4 shadow-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                            {deviceType === "ios" ? (
                                <svg className="w-7 h-7 fill-white shrink-0" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.97.08 2.05-.52 2.82-1.33z"/>
                                </svg>
                            ) : deviceType === "android" ? (
                                <svg className="w-7 h-7 fill-white shrink-0" viewBox="0 0 24 24">
                                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-5.72-4.72l1.17-1.17a.495.495 0 0 0 0-.7c-.2-.2-.51-.2-.71 0l-1.48 1.48C12.94 2.32 12.48 2 12 2s-.94.32-1.76.89L8.76 1.41a.495.495 0 0 0-.7 0c-.2.2-.2.51 0 .71l1.17 1.17C7.61 4.54 6.53 6.1 6.17 8h11.66c-.36-1.9-1.44-3.46-3.05-4.72zM9.5 6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm5 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
                                </svg>
                            ) : (
                                <img src="https://ik.imagekit.io/dypkhqxip/logo__1_" alt="Redlix Portal" className="w-7 h-7 object-contain shrink-0" />
                            )}
                            <div className="h-6 w-px bg-white/10 shrink-0 self-center" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-white tracking-tight leading-tight font-sans">Add to Home Screen</p>
                                <p className="text-xs text-white/40 mt-0.5 font-sans">Install the Redlix Employee Portal app</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5 shrink-0">
                            <button
                                onClick={handleInstall}
                                className="flex items-center gap-1.5 border border-white/10 bg-transparent hover:bg-white/5 text-white text-xs font-semibold px-4 py-2 transition-colors cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5 text-white/60" />
                                <span>Install</span>
                            </button>
                            <button
                                onClick={handleDismissBanner}
                                className="text-white/30 hover:text-white/70 p-2 transition-colors cursor-pointer"
                                aria-label="Dismiss"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Login Modal / Pretty Error Screen */}
            {socialModal !== "none" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[#111111] border border-white/10 p-6 flex flex-col gap-5 text-white shadow-2xl relative animate-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setSocialModal("none")}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {socialStatus === "input" ? (
                            <form onSubmit={handleSocialLogin} className="space-y-4">
                                <div className="flex flex-col items-center text-center gap-2 mb-2">
                                    <div className="p-3 bg-white/5 border border-white/10">
                                        {socialModal === "google" ? (
                                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15.01 1 12 1 7.24 1 3.23 3.65 1.12 7.54l3.85 2.99C5.9 7.42 8.7 5.04 12 5.04z"
                                                />
                                                <path
                                                    fill="#4285F4"
                                                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.52z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.87 14.53A6.98 6.98 0 015.5 12c0-.88.16-1.73.44-2.52L2.09 6.49A11.94 11.94 0 001 12c0 2.05.52 4.02 1.44 5.76l3.43-3.23z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.1.74-2.51 1.18-4.3 1.18-3.3 0-6.1-2.38-7.03-5.49L1.12 15.93C3.23 19.82 7.24 23 12 23z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 fill-white" viewBox="0 0 16 16">
                                                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="text-md font-semibold tracking-tight text-white mt-1">
                                        Sign in with {socialModal === "google" ? "Google" : "Apple"}
                                    </h3>
                                    <p className="text-[11px] text-white/50 leading-relaxed">
                                        Please enter your {socialModal === "google" ? "Google" : "Apple"} email address to verify your account registration.
                                    </p>
                                </div>

                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-white/50 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                        <input
                                            type="email"
                                            required
                                            value={socialEmail}
                                            onChange={(e) => setSocialEmail(e.target.value)}
                                            placeholder="name@redlix.com"
                                            className="w-full bg-[#151515] border border-white/10 px-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={socialChecking}
                                    className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-50 py-2.5 transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
                                >
                                    {socialChecking ? (
                                        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                    ) : (
                                        <span className="text-xs font-semibold uppercase tracking-wider text-white">Continue</span>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* Pretty Screen: Lock / Error Screen */
                            <div className="flex flex-col items-center text-center gap-4 py-4 animate-in fade-in duration-200">
                                <div className="w-12 h-12 border border-[#E61E32]/20 bg-[#E61E32]/10 flex items-center justify-center text-[#E61E32]">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-md font-semibold tracking-tight text-[#E61E32]">
                                        Access Denied
                                    </h3>
                                    <p className="text-xs text-white/80 max-w-xs leading-relaxed mt-2">
                                        The email <span className="font-semibold text-white">"{socialEmail}"</span> is not registered in our employee portal database.
                                    </p>
                                    <p className="text-[11px] text-white/40 leading-relaxed mt-1">
                                        Only pre-authorized team members can log in through {socialModal === "google" ? "Google" : "Apple"}. Please contact IT support to request access.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSocialStatus("input")}
                                    className="w-full border border-white/10 bg-[#151515] hover:bg-[#1d1d1d] hover:border-white/20 text-white text-xs font-medium py-2.5 transition-all cursor-pointer mt-2"
                                >
                                    Try Another Account
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
