"use client";

import React, { useState, useEffect } from "react";
import { X, Settings, ShieldCheck, PieChart } from "lucide-react";

export default function CookieButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [preferencesOn, setPreferencesOn] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const [hasDecided, setHasDecided] = useState(false);

    useEffect(() => {
        const savedPrefs = localStorage.getItem("redlix_cookie_prefs");
        if (savedPrefs) {
            const parsed = JSON.parse(savedPrefs);
            setPreferencesOn(parsed.performance);
            setHasDecided(true);

            if (parsed.performance && (window as any).gtag) {
                (window as any).gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                });
            }
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        document.documentElement.setAttribute("data-experience-level", preferencesOn ? "optimized" : "standard");
        if (preferencesOn) {
            document.body.classList.add("system-upgrade-active");
        } else {
            document.body.classList.remove("system-upgrade-active");
        }
    }, [preferencesOn, isHydrated]);

    const handleSave = (allAccepted: boolean, prefValue?: boolean) => {
        const value = allAccepted ? true : (prefValue ?? preferencesOn);
        setPreferencesOn(value);
        localStorage.setItem("redlix_cookie_prefs", JSON.stringify({
            essential: true,
            performance: value,
            timestamp: new Date().toISOString()
        }));
        setIsOpen(false);
        setHasDecided(true);

        if ((window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': value ? 'granted' : 'denied',
                'ad_storage': value ? 'granted' : 'denied',
                'ad_user_data': value ? 'granted' : 'denied',
                'ad_personalization': value ? 'granted' : 'denied'
            });
        }
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    if (!isHydrated) return null;

    return (
        <>
            {/* The Floating Privacy Consent Card */}
            {!hasDecided && !isOpen && (
                <div className="fixed bottom-6 left-6 z-[120] max-w-[340px] w-[calc(100%-2rem)] bg-white border border-zinc-200/70 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden text-left font-sans">
                    
                    {/* Top Content */}
                    <div className="p-4 pb-2.5">
                        <h3 className="text-[14px] font-medium text-zinc-900 flex items-center gap-1.5 mb-1.5 select-none">
                            <span className="text-[18px] leading-none">🍪</span> We value your privacy!
                        </h3>
                        <p className="text-[12px] font-normal text-zinc-500 leading-normal">
                            Our website uses tracking cookies to understand how you interact with it. The tracking will be enabled only if you accept.{" "}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="text-zinc-900 hover:text-zinc-600 underline font-medium cursor-pointer focus:outline-none ml-0.5"
                            >
                                Manage preferences
                            </button>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-zinc-100" />

                    {/* Action Buttons */}
                    <div className="p-3 flex gap-2 bg-white">
                        <button
                            onClick={() => handleSave(true)}
                            className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-[12px] rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                            Accept all
                        </button>
                        <button
                            onClick={() => handleSave(false, false)}
                            className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-[12px] rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                            Reject all
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-zinc-100" />

                    {/* Footer Policy Links */}
                    <div className="px-4 py-2 bg-white flex gap-4 text-[11px] text-zinc-400 select-none">
                        <a href="/privacy" className="hover:text-zinc-600 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="hover:text-zinc-600 transition-colors">
                            Terms of Service
                        </a>
                    </div>

                </div>
            )}

            {/* Modal Settings Overhaul (Light Theme) */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-md z-[125] transition-opacity duration-700 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}
            />

            <div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] md:w-[460px] max-h-[90vh] bg-white border border-gray-200 z-[130] shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-2xl flex flex-col transform transition-all duration-300 overflow-hidden ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            >
                <div className="p-5 md:p-6 overflow-y-auto">
                    <div className="flex justify-between items-start mb-5">
                        <div className="pr-4">
                            <h2 className="text-[#202124] text-[18px] font-semibold tracking-tight leading-tight mb-1.5">
                                Cookie settings
                            </h2>
                            <p className="text-[#5f6368] text-[12.5px] leading-relaxed">
                                Manage how Redlix Studio stores data on your device. Essential cookies cannot be turned off because the site needs them to work safely.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#202124] hover:bg-gray-50 transition-all shrink-0 cursor-pointer"
                            aria-label="Close settings"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start gap-3 mb-1.5">
                                <div className="w-8 h-8 rounded-lg bg-[#E61E32]/10 flex items-center justify-center text-[#E61E32] shrink-0">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[#202124] font-medium text-[14px]">Essential cookies</h4>
                                    <span className="text-[10px] font-normal text-zinc-400">Always active</span>
                                </div>
                            </div>
                            <p className="text-[#5f6368] text-[12px] leading-relaxed pl-11">
                                Required for security, spam protection (Google reCAPTCHA on contact and support forms), session management, and storing your cookie preference. Without these, parts of the site may not function.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex justify-between items-start gap-3 mb-1.5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                        <PieChart className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#202124] font-medium text-[14px]">Analytics cookies</h4>
                                        <span className="text-[10px] font-normal text-zinc-400">Optional</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPreferencesOn(!preferencesOn)}
                                    aria-label={preferencesOn ? "Disable analytics cookies" : "Enable analytics cookies"}
                                    className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 cursor-pointer ${preferencesOn ? "bg-[#E61E32]" : "bg-gray-300"}`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform shadow-sm ${preferencesOn ? "translate-x-4.5" : "translate-x-0"}`}
                                    />
                                </button>
                            </div>
                            <p className="text-[#5f6368] text-[12px] leading-relaxed pl-11">
                                When enabled, we use Google Analytics (G-MB42FW3TGE) to collect anonymous statistics such as pages visited, time on site, and general device type. This helps us improve performance and content. No advertising profiles are built from this data on our marketing site.
                            </p>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed px-1">
                            We do not sell your data. Third-party providers may process information according to their own policies. See our{" "}
                            <a href="/cookies" className="text-[#E61E32] hover:underline font-medium">Cookies Policy</a> for a full list of technologies and retention periods.
                        </p>
                    </div>
                </div>

                <div className="p-4 md:p-5 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row gap-2.5">
                    <button
                        type="button"
                        onClick={() => handleSave(false, false)}
                        className="flex-1 py-2.5 bg-white border border-gray-200 text-[#202124] text-[13px] font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Decline optional
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSave(false)}
                        className="flex-1 py-2.5 bg-[#1E2022] text-white text-[13px] font-medium rounded-xl hover:bg-[#2C3036] transition-colors cursor-pointer"
                    >
                        Save preferences
                    </button>
                </div>
            </div>

        </>
    );
}








