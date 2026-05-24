"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Send, Search } from "lucide-react";
import { countries } from "@/utils/countries";

const services = [
    "AI & Automation",
    "Software Engineering",
    "Web & Mobile Development",
    "Product Design (UI/UX)",
    "Enterprise Solutions",
    "Branding & Strategy"
];

const ContactPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCountrySelector, setShowCountrySelector] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.name === "India") || countries[0]);
    const filteredCountries = useMemo(() => {
        return countries.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.includes(searchQuery)
        );
    }, [searchQuery]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const togglePopup = () => setIsOpen(!isOpen);

    // Explicitly render reCAPTCHA when modal opens
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                // @ts-ignore
                if (window.grecaptcha?.enterprise && document.getElementById('recaptcha-container')) {
                    try {
                        // @ts-ignore
                        window.grecaptcha.enterprise.render('recaptcha-container', {
                            'sitekey': '6LeKMbksAAAAAAr38bUfV7f2ShiEbSabyFLfzqEO',
                            'action': 'CONTACT',
                            'theme': 'dark'
                        });
                    } catch (e) {
                        // Already rendered or error
                        console.log("reCAPTCHA transition or already rendered");
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            // Get reCAPTCHA token
            // Note: window.grecaptcha is loaded by the script in layout.tsx
            // @ts-ignore
            const token = window.grecaptcha?.enterprise?.getResponse();

            if (!token) {
                alert("Please complete the reCAPTCHA verification.");
                setIsSubmitting(false);
                return;
            }

            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, formData: data }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus("success");
                setTimeout(() => {
                    setIsOpen(false);
                    setSubmitStatus("idle");
                }, 2000);
            } else {
                setSubmitStatus("error");
                alert(result.message || "Submission failed.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        if (typeof document !== 'undefined') document.body.style.overflow = "unset";
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={togglePopup}
                aria-label="Get in touch"
                className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-[100] bg-[#E61E32] hover:bg-[#CC192A] text-white px-6 py-3 flex items-center gap-2.5 rounded-xl text-[14px] font-semibold shadow-[0_4px_12px_rgba(230,30,50,0.25)] hover:shadow-[0_6px_20px_rgba(230,30,50,0.35)] active:scale-[0.98] transition-all duration-300"
            >
                <Send className="w-4 h-4 shrink-0" />
                <span>Get in Touch</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={togglePopup}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-[1100px] h-fit max-h-[92vh] bg-[#1a1a1a] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <h2 className="text-[28px] md:text-[32px] font-bold text-[#E61E32] tracking-tight">
                                Get in Touch with us
                            </h2>
                            <button
                                onClick={togglePopup}
                                className="text-white/40 hover:text-white transition-colors p-2"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Scrollable Form Area */}
                        <div className="flex-grow overflow-y-auto px-8 pb-8 custom-scrollbar">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
                                    {/* Your Name */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Your Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            className="w-full h-11 bg-transparent border border-white/20 px-4 text-white text-[13px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-white/5"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Phone Number
                                        </label>
                                        <div className="flex h-11 relative">
                                            <div
                                                onClick={() => setShowCountrySelector(!showCountrySelector)}
                                                className="flex items-center gap-2 border border-r-0 border-white/20 px-3 bg-white/5 shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
                                            >
                                                <img src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} alt={selectedCountry.name} className="w-4 h-auto" />
                                                <span className="text-[12px] text-white/60">{selectedCountry.code}</span>
                                            </div>

                                            {showCountrySelector && (
                                                <div className="absolute top-full left-0 z-[120] w-72 mt-1 bg-[#1a1a1a] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2">
                                                    {/* Search Bar */}
                                                    <div className="sticky top-0 bg-[#1a1a1a] p-3 border-b border-white/10">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                            <input
                                                                type="text"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                placeholder="Search country..."
                                                                className="w-full bg-[#222] border border-white/10 rounded-sm py-2 pl-9 pr-4 text-[13px] text-white focus:outline-none focus:border-[#E61E32] transition-colors"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Countries List */}
                                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                        {filteredCountries.length > 0 ? (
                                                            filteredCountries.map((c) => (
                                                                <div
                                                                    key={c.name}
                                                                    onClick={() => {
                                                                        setSelectedCountry(c);
                                                                        setShowCountrySelector(false);
                                                                        setSearchQuery("");
                                                                    }}
                                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#E61E32]/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                                                >
                                                                    <img src={`https://flagcdn.com/w20/${c.flag}.png`} className="w-4 h-auto" alt={c.name} />
                                                                    <span className="text-[13px] text-white/80 font-medium">{c.name}</span>
                                                                    <span className="ml-auto text-[11px] text-white/30">{c.code}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-6 text-center text-white/20 text-[12px]">No country found</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                name="phone"
                                                type="tel"
                                                className="w-full h-full bg-transparent border border-white/20 px-4 text-white text-[13px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-white/5"
                                                placeholder="081234 56789"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full h-11 bg-transparent border border-white/20 px-4 text-white text-[13px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-white/5"
                                            placeholder="hello@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Company Name */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Company Name
                                        </label>
                                        <input
                                            name="company"
                                            type="text"
                                            className="w-full h-11 bg-transparent border border-white/20 px-4 text-white text-[13px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-white/5"
                                            placeholder="Your business name"
                                        />
                                    </div>

                                    {/* Website Link */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Website Link (Optional)
                                        </label>
                                        <input
                                            name="website"
                                            type="url"
                                            className="w-full h-11 bg-transparent border border-white/20 px-4 text-white text-[13px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-white/5"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Business Type */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Business Type
                                        </label>
                                        <select name="businessType" className="w-full h-11 bg-[#1a1a1a] border border-white/20 px-4 text-white/50 text-[13px] focus:border-[#E61E32] focus:outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">please select</option>
                                            <option value="startup">Startup</option>
                                            <option value="enterprise">Enterprise</option>
                                            <option value="agency">Agency</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Company Turnover */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Company Turnover (₹)
                                        </label>
                                        <select name="turnover" className="w-full h-11 bg-[#1a1a1a] border border-white/20 px-4 text-white/50 text-[13px] focus:border-[#E61E32] focus:outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">please select</option>
                                            <option value="<10L">Below 10 Lakhs</option>
                                            <option value="10L-50L">10 Lakhs - 50 Lakhs</option>
                                            <option value="50L-1Cr">50 Lakhs - 1 Crore</option>
                                            <option value=">1Cr">Above 1 Crore</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.25em]">What services are you looking for?</p>
                                    <div className="flex flex-wrap gap-x-10 gap-y-4">
                                        {services.map((service) => (
                                            <label key={service} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input type="radio" name="service" value={service} className="sr-only peer" />
                                                    <div className="w-4 h-4 border border-white/20 rounded-full peer-checked:border-[#E61E32] transition-colors" />
                                                    <div className="absolute w-2 h-2 bg-[#E61E32] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                                </div>
                                                <span className="text-[11px] text-white/50 group-hover:text-white transition-colors uppercase tracking-wider">{service}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Budget */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Monthly Budget (₹)
                                        </label>
                                        <select name="budget" className="w-full h-11 bg-[#1a1a1a] border border-white/20 px-4 text-white/50 text-[13px] focus:border-[#E61E32] focus:outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">please select</option>
                                            <option value="<25k">Below 25k</option>
                                            <option value="25k-50k">25k - 50k</option>
                                            <option value="50k-1L">50k - 1 Lakh</option>
                                            <option value=">1L">Above 1 Lakh</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            How soon would you like to get started?
                                        </label>
                                        <select name="timeline" className="w-full h-11 bg-[#1a1a1a] border border-white/20 px-4 text-white/50 text-[13px] focus:border-[#E61E32] focus:outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">please select</option>
                                            <option value="immediately">Immediately</option>
                                            <option value="1-2weeks">1-2 Weeks</option>
                                            <option value="1month">Within 1 Month</option>
                                            <option value="exploring">Just Exploring</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Date/Time */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Preferred Date & Time
                                        </label>
                                        <div className="relative flex items-center h-11 border border-white/20 px-4">
                                            <input
                                                name="preferredDateTime"
                                                type="datetime-local"
                                                className="w-full bg-transparent text-white/30 text-[12px] focus:outline-none [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    {/* Timezone */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Preferred Timezone
                                        </label>
                                        <select name="timezone" className="w-full h-11 bg-[#1a1a1a] border border-white/20 px-4 text-white/50 text-[13px] focus:border-[#E61E32] focus:outline-none transition-all appearance-none cursor-pointer">
                                            <option value="Asia/Kolkata">Asia/Kolkata</option>
                                            <option value="UTC">UTC</option>
                                            <option value="US/Eastern">US/Eastern</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Mode */}
                                    <div className="relative group">
                                        <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                            Preferred Mode
                                        </label>
                                        <select name="preferredMode" className="w-full h-11 bg-[#1a1a1a] border border-white/20 px-4 text-white/50 text-[13px] focus:border-[#E61E32] focus:outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">please select</option>
                                            <option value="google-meet">Google Meet</option>
                                            <option value="zoom">Zoom</option>
                                            <option value="phone">Phone Call</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="relative group">
                                    <label className="absolute -top-[9px] left-3 z-10 bg-[#1a1a1a] px-1.5 text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        required
                                        className="w-full bg-transparent border border-white/20 px-4 py-3 text-white text-[13px] focus:border-[#E61E32] focus:outline-none transition-all resize-none min-h-[90px] placeholder:text-white/5"
                                        placeholder="Enter your message here..."
                                    />
                                </div>

                                {/* Captcha Verification */}
                                <div className="space-y-1">
                                    <div
                                        id="recaptcha-container"
                                        className="g-recaptcha"
                                    ></div>
                                    <p className="text-[10px] text-white/30 italic">Please complete the verification above.</p>
                                </div>

                                {/* Footer & Submit */}
                                <div className="space-y-3">
                                    <p className="text-[10px] text-white/20 leading-relaxed max-w-4xl font-light">
                                        By submitting this form, you acknowledge our <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                                    </p>
                                    <button
                                        disabled={isSubmitting}
                                        className="bg-[#E61E32] text-white px-8 py-2.5 flex items-center gap-3 shadow-xl hover:bg-[#CC192A] transition-all rounded-none group scale-100 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed border border-white/10"
                                    >
                                        <span className="text-[14px] font-medium">
                                            {submitStatus === "success" ? "Sent" : isSubmitting ? "Sending..." : "Submit"}
                                        </span>
                                        <Send className={`w-4 h-4 transition-transform ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
};

export default ContactPopup;
