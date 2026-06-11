"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Send, Search, ChevronDown } from "lucide-react";
import { countries } from "@/utils/countries";

const services = [
    "Web Design & Development",
    "Web and Mobile App Design",
    "SaaS & Custom Software",
    "AI & Automation",
    "Enterprise Solutions"
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
                className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-[100] bg-[#E61E32] hover:bg-[#ff1f34] text-white px-6 py-3 flex items-center gap-2.5 rounded-xl text-[14px] font-semibold shadow-[0_4px_16px_rgba(230,30,50,0.3)] hover:shadow-[0_8px_24px_rgba(230,30,50,0.45)] active:scale-[0.97] transition-all duration-300"
            >
                <Send className="w-4 h-4 shrink-0" />
                <span>Get in Touch</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={togglePopup}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-[1000px] h-fit max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300" style={{ background: '#f0f0f0', borderRadius: 0 }}>
                        {/* Header */}
                        <div className="px-8 pt-5 pb-4 flex justify-between items-center border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/logo__1_?updatedAt=1781048454786"
                                    alt="Redlix"
                                    className="h-12 w-auto object-contain"
                                />
                                <div className="w-px h-8 bg-gray-300" />
                                <div>
                                    <span className="text-[10px] font-semibold text-[#E61E32] mb-0.5 block">Partner With Us</span>
                                    <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 tracking-tight leading-tight">
                                        Let's build something great
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={togglePopup}
                                className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-200"
                                style={{ borderRadius: 0 }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Form Area */}
                        <div className="flex-grow overflow-y-auto px-8 pb-6 pt-5 custom-scrollbar">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                                    {/* Your Name */}
                                    <div className="relative group">
                                        <label className="absolute -top-[8px] left-3 z-10 px-1 text-[10px] font-medium text-gray-500 transition-colors group-focus-within:text-[#E61E32]" style={{ background: '#f0f0f0' }}>
                                            Your Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            className="w-full h-9 bg-white border border-gray-300 px-3 text-gray-900 text-[12px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-gray-400"
                                            style={{ borderRadius: 0 }}
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative group">
                                        <label className="absolute -top-[8px] left-3 z-10 px-1 text-[10px] font-medium text-gray-500 transition-colors group-focus-within:text-[#E61E32]" style={{ background: '#f0f0f0' }}>
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full h-9 bg-white border border-gray-300 px-3 text-gray-900 text-[12px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-gray-400"
                                            style={{ borderRadius: 0 }}
                                            placeholder="hello@example.com"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="relative group">
                                        <label className="absolute -top-[8px] left-3 z-10 px-1 text-[10px] font-medium text-gray-500 transition-colors group-focus-within:text-[#E61E32]" style={{ background: '#f0f0f0' }}>
                                            Phone Number
                                        </label>
                                        <div className="flex h-9 relative">
                                            <div
                                                onClick={() => setShowCountrySelector(!showCountrySelector)}
                                                className="flex items-center gap-1.5 border border-r-0 border-gray-300 px-2.5 bg-gray-100 shrink-0 cursor-pointer hover:bg-gray-200 transition-colors"
                                                style={{ borderRadius: 0 }}
                                            >
                                                <img src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} alt={selectedCountry.name} className="w-4 h-auto" />
                                                <span className="text-[12px] text-gray-600">{selectedCountry.code}</span>
                                                <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                            </div>

                                            {showCountrySelector && (
                                                <div className="absolute top-full left-0 z-[120] w-72 mt-1 bg-white border border-gray-200 shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden" style={{ borderRadius: 0 }}>
                                                    {/* Search Bar */}
                                                    <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                placeholder="Search country..."
                                                                className="w-full bg-gray-50 border border-gray-200 py-2 pl-9 pr-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#E61E32] transition-colors"
                                                                style={{ borderRadius: 0 }}
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
                                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                                                >
                                                                    <img src={`https://flagcdn.com/w20/${c.flag}.png`} className="w-4 h-auto" alt={c.name} />
                                                                    <span className="text-[13px] text-gray-800 font-medium">{c.name}</span>
                                                                    <span className="ml-auto text-[11px] text-gray-400">{c.code}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-6 text-center text-gray-400 text-[12px]">No country found</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                name="phone"
                                                type="tel"
                                                required
                                                className="w-full h-full bg-white border border-gray-300 px-3 text-gray-900 text-[12px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-gray-400"
                                                style={{ borderRadius: 0 }}
                                                placeholder="081234 56789"
                                            />
                                        </div>
                                    </div>

                                    {/* Company Name */}
                                    <div className="relative group">
                                        <label className="absolute -top-[8px] left-3 z-10 px-1 text-[10px] font-medium text-gray-500 transition-colors group-focus-within:text-[#E61E32]" style={{ background: '#f0f0f0' }}>
                                            Company Name
                                        </label>
                                        <input
                                            name="company"
                                            type="text"
                                            required
                                            className="w-full h-9 bg-white border border-gray-300 px-3 text-gray-900 text-[12px] focus:border-[#E61E32] focus:outline-none transition-all placeholder:text-gray-400"
                                            style={{ borderRadius: 0 }}
                                            placeholder="Your business name"
                                        />
                                    </div>
                                </div>

                                {/* Services Select - Premium tags style */}
                                <div className="space-y-3">
                                    <p className="text-[11px] font-medium text-gray-500">What services are you looking for?</p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {services.map((service) => (
                                            <label key={service} className="cursor-pointer">
                                                <input type="radio" name="service" value={service} className="sr-only peer" />
                                                <div className="px-3.5 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-600 text-[12px] font-medium transition-all duration-200 peer-checked:bg-[#E61E32] peer-checked:border-[#E61E32] peer-checked:text-white peer-checked:shadow-[0_4px_12px_rgba(230,30,50,0.25)]" style={{ borderRadius: 0 }}>
                                                    {service}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="relative group">
                                    <label className="absolute -top-[9px] left-3.5 z-10 px-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-[#E61E32]" style={{ background: '#f0f0f0' }}>
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={2}
                                        required
                                        className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-900 text-[12px] focus:border-[#E61E32] focus:outline-none transition-all resize-none min-h-[70px] placeholder:text-gray-400"
                                        style={{ borderRadius: 0 }}
                                        placeholder="Enter your message here..."
                                    />
                                </div>

                                {/* Captcha Verification */}
                                <div className="space-y-1.5">
                                    <div
                                        id="recaptcha-container"
                                        className="g-recaptcha"
                                    ></div>
                                    <p className="text-[10px] text-gray-400 italic">Please complete the verification above.</p>
                                </div>

                                {/* Footer & Submit */}
                                <div className="space-y-3 pt-2">
                                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-4xl font-light">
                                        By submitting this form, you acknowledge and agree to our <a href="/privacy" className="text-[#E61E32] underline hover:text-[#ff1f34] transition-colors font-medium">Privacy Policy</a>.
                                    </p>
                                    <button
                                        disabled={isSubmitting}
                                        className="bg-[#E61E32] hover:bg-gray-900 text-white px-8 py-3 flex items-center gap-3 shadow-[0_4px_16px_rgba(230,30,50,0.3)] hover:shadow-[0_6px_22px_rgba(230,30,50,0.45)] transition-all group scale-100 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                        style={{ borderRadius: 0 }}
                                    >
                                        <span className="text-[13px] font-semibold">
                                            {submitStatus === "success" ? "Sent" : isSubmitting ? "Sending..." : "Submit Inquiry"}
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
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
};

export default ContactPopup;
