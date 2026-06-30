"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/admin");
            } else {
                setError(data.message || "Invalid username or password");
                setLoading(false);
            }
        } catch (err) {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 sm:mb-10 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-sm text-white/60">Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Admin ID"
                                className="w-full bg-[#111111] border border-white/10 px-12 py-3.5 text-sm text-white focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#111111] border border-white/10 px-12 py-3.5 text-sm text-white focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-3 rounded-lg">
                            <p className="text-sm text-[#E61E32] text-center font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E61E32] hover:bg-[#ff1f34] rounded-lg disabled:opacity-50 py-3.5 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                            <span className="text-sm font-semibold text-white">Sign in</span>
                        )}
                    </button>
                    
                    <p className="text-center text-xs text-white/30">
                        Redlix Studio Admin Portal
                    </p>
                </form>
            </div>
        </main>
    );
}
