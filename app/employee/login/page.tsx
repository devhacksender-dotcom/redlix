"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";

export default function EmployeeLogin() {
    const router = useRouter();
    const [view, setView] = useState<"login" | "forgot">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
        } catch (err) {
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
        } catch (err) {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Simple Header */}
                <div className="mb-10 text-center">
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
                            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">Email Address</label>
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
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">Password</label>
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
                                <p className="text-xs text-[#E61E32] text-center font-medium">
                                    {error}
                                </p>
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
                            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">Email Address</label>
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

                        {/* Error Message */}
                        {error && (
                            <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-3">
                                <p className="text-xs text-[#E61E32] text-center font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-green-500/10 border border-green-500/20 p-3">
                                <p className="text-xs text-green-500 text-center font-medium">
                                    {successMessage}
                                </p>
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
                                <span className="text-sm font-bold uppercase tracking-widest text-white">Send Reset Link</span>
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
