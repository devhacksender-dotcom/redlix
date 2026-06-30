"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid request. Missing token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/employee/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
                <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Password Reset Complete</h2>
                    <p className="text-sm text-white/40">Your password has been successfully updated.</p>
                </div>
                <button
                    onClick={() => router.push("/employee/login")}
                    className="w-full bg-[#E61E32] hover:bg-[#ff1f34] py-3.5 text-sm font-bold  tracking-widest text-white transition-all cursor-pointer"
                >
                    Proceed to Login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
                <label className="text-xs font-semibold  tracking-wider text-white/60">New Password</label>
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

            <div className="space-y-2">
                <label className="text-xs font-semibold  tracking-wider text-white/60">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#111111] border border-white/10 px-12 py-3.5 text-sm text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-3">
                    <p className="text-xs text-[#E61E32] text-center font-medium">
                        {error}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] disabled:opacity-50 py-3.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                    <span className="text-sm font-bold  tracking-widest text-white">Reset Password</span>
                )}
            </button>

            <button
                type="button"
                onClick={() => router.push("/employee/login")}
                className="w-full flex items-center justify-center gap-2 text-xs text-white/50 hover:text-white transition-colors py-2 cursor-pointer"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                    <p className="text-sm text-white/40">Enter your new credentials below</p>
                </div>
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <Loader2 className="w-8 h-8 text-[#E61E32] animate-spin" />
                        <p className="text-xs text-white/40">Verifying session...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}
