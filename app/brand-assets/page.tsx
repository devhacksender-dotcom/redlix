"use client";

import React from "react";
import Link from "next/link";
import CorporateFooter from "@/components/CorporateFooter";
import { XCircle } from "lucide-react";

export default function BrandAssetsPage() {
    const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

    const handleCopy = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 1500);
    };

    const handleDownload = async (url: string, filename: string, colorOverride?: string) => {
        try {
            const svgContent = await new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const width = img.naturalWidth || img.width || 500;
                    const height = img.naturalHeight || img.height || 500;
                    
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) {
                        reject(new Error("Could not get canvas 2d context"));
                        return;
                    }
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    if (colorOverride) {
                        const hex = colorOverride.replace("#", "");
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);
                        
                        const imgData = ctx.getImageData(0, 0, width, height);
                        const data = imgData.data;
                        
                        for (let i = 0; i < data.length; i += 4) {
                            const alpha = data[i + 3];
                            if (alpha > 0) {
                                data[i] = r;
                                data[i + 1] = g;
                                data[i + 2] = b;
                            }
                        }
                        ctx.putImageData(imgData, 0, 0);
                    }
                    
                    const base64 = canvas.toDataURL("image/png");
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <image href="${base64}" x="0" y="0" width="${width}" height="${height}"/>
</svg>`;
                    resolve(svg);
                };
                img.onerror = (err) => reject(err);
                img.src = url;
            });

            const blob = new Blob([svgContent], { type: "image/svg+xml" });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Failed to download logo as SVG:", error);
            window.open(url, "_blank");
        }
    };

    const brandColors = [
        { name: "Redlix Red", hex: "#E61E32" },
        { name: "Slate Dark", hex: "#1E2022" },
        { name: "Charcoal Black", hex: "#070809" },
        { name: "Highlight Green", hex: "#92E3A9" },
        { name: "White", hex: "#FFFFFF" }
    ];

    return (
        <div className="w-full min-h-screen bg-white text-zinc-800 font-sans relative overflow-hidden pt-20">

            {/* Background Technical Watermark Image Overlay */}
            <div
                className="absolute inset-x-0 top-[-20px] h-[560px] pointer-events-none overflow-hidden opacity-[0.25] bg-center bg-[length:1200px_auto] bg-no-repeat z-0 select-none"
                style={{
                    backgroundImage: "url('https://ik.imagekit.io/dypkhqxip/sketch01')",
                }}
            />

            {/* Giant background text outline */}
            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center z-0 overflow-hidden">
                <span className="text-[120px] sm:text-[180px] lg:text-[240px] font-black text-zinc-950/[0.012] tracking-tighter leading-none uppercase select-none">
                    Redlix
                </span>
            </div>

            {/* Same-to-same Brand Assets Header Layout */}
            <div className="w-full border-b border-dashed border-zinc-200/80 pt-24 pb-16 sm:py-20 lg:py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
                        {/* Left Column: Right-aligned description */}
                        <div className="text-center md:text-right">
                            <h1 className="text-[21px] sm:text-[23px] lg:text-[26px] font-light text-zinc-800 leading-[1.4] tracking-tight">
                                The identity of <span className="font-semibold text-zinc-950">Redlix Studio</span> <br />
                                represents intelligent code <br />
                                and strategic engineering
                            </h1>
                        </div>

                        {/* Center Column: Redlix Logo Icon */}
                        <div className="flex justify-center items-center">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-red-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                    alt="Redlix Logo Icon"
                                    className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Right Column: Left-aligned details */}
                        <div className="flex flex-col gap-6 text-center md:text-left text-zinc-500 text-[13.5px] sm:text-[14px] font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                            <p>
                                The minimal, geometric layout of the <span className="font-semibold text-zinc-900">Redlix Studio logo</span> reflects our core principles: speed, robustness, and absolute structural precision. It is designed to work seamlessly across high-end user interfaces, developer portals, and brand layouts.
                            </p>
                            <p>
                                Dominated by our brand red color, the identity embodies the energy, clarity, and performance-driven results we build for global enterprise clients and modern products.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10">
                {/* Section: Glyph */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h2 className="text-lg sm:text-[19px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                            Glyph
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {/* 1. Redlix Red (Primary) */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/logo__1_", "redlix-glyph-red.svg", "#E61E32")}
                            className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - Red"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>

                        {/* 2. Charcoal Black */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/logo__1_", "redlix-glyph-black.svg", "#070809")}
                            className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - Black"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>

                        {/* 3. Slate Dark */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/logo__1_", "redlix-glyph-slate.svg", "#1E2022")}
                            className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - Slate"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 opacity-60 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>

                        {/* 4. White on Black */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/logo__1_", "redlix-glyph-white.svg", "#FFFFFF")}
                            className="bg-zinc-950 border border-zinc-900 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - White"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Inline */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h2 className="text-lg sm:text-[19px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                            Inline
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {/* 1. Redlix Red (Primary) */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493", "redlix-inline-red.svg", "#E61E32")}
                            className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - Red"
                                className="max-w-full max-h-[36px] object-contain group-hover:scale-105 transition-transform duration-300"
                                style={{ filter: "brightness(0) saturate(100%) invert(24%) sepia(86%) saturate(6382%) hue-rotate(349deg) brightness(97%) contrast(92%)" }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>

                        {/* 2. Charcoal Black */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493", "redlix-inline-black.svg", "#070809")}
                            className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - Black"
                                className="max-w-full max-h-[36px] object-contain brightness-0 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>

                        {/* 3. Slate Dark */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493", "redlix-inline-slate.svg", "#1E2022")}
                            className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - Slate"
                                className="max-w-full max-h-[36px] object-contain brightness-0 opacity-60 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>

                        {/* 4. White on Black */}
                        <div 
                            onClick={() => handleDownload("https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493", "redlix-inline-white.svg", "#FFFFFF")}
                            className="bg-zinc-950 border border-zinc-900 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group cursor-pointer relative"
                        >
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - White"
                                className="max-w-full max-h-[36px] object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white rounded-[24px]">
                                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-[10px] font-bold tracking-wider text-white/90">DOWNLOAD SVG</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Things To Avoid */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h2 className="text-lg sm:text-[19px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                            Things To Avoid
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {/* 1. Don't Add Effects */}
                        <div className="flex flex-col gap-3">
                            <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Don't Add Effects"
                                    className="max-w-full max-h-[36px] object-contain"
                                    style={{
                                        filter: "brightness(0) saturate(100%) invert(24%) sepia(86%) saturate(6382%) hue-rotate(349deg) brightness(97%) contrast(92%) drop-shadow(0 0 10px rgba(230,30,50,0.85)) blur(0.5px)"
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-1 text-[12.5px] font-medium text-zinc-500">
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <span>Don't Add Effects</span>
                            </div>
                        </div>

                        {/* 2. Don't Stretch Images */}
                        <div className="flex flex-col gap-3">
                            <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Don't Stretch"
                                    className="max-w-full max-h-[36px] object-contain"
                                    style={{
                                        filter: "brightness(0) saturate(100%) invert(24%) sepia(86%) saturate(6382%) hue-rotate(349deg) brightness(97%) contrast(92%)",
                                        transform: "scaleX(1.6) scaleY(0.7)"
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-1 text-[12.5px] font-medium text-zinc-500">
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <span>Don't Stretch Images</span>
                            </div>
                        </div>

                        {/* 3. Don't Flip */}
                        <div className="flex flex-col gap-3">
                            <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Don't Flip"
                                    className="max-w-full max-h-[36px] object-contain"
                                    style={{
                                        filter: "brightness(0) saturate(100%) invert(24%) sepia(86%) saturate(6382%) hue-rotate(349deg) brightness(97%) contrast(92%)",
                                        transform: "scaleX(-1)"
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-1 text-[12.5px] font-medium text-zinc-500">
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <span>Don't Flip</span>
                            </div>
                        </div>

                        {/* 4. Don't Rotate */}
                        <div className="flex flex-col gap-3">
                            <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Don't Rotate"
                                    className="max-w-full max-h-[36px] object-contain"
                                    style={{
                                        filter: "brightness(0) saturate(100%) invert(24%) sepia(86%) saturate(6382%) hue-rotate(349deg) brightness(97%) contrast(92%)",
                                        transform: "rotate(-15deg)"
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-1 text-[12.5px] font-medium text-zinc-500">
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <span>Don't Rotate</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Application Examples */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h2 className="text-lg sm:text-[19px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                            Application Examples
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-2" />
                    </div>

                    {/* Brand Concept Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        
                        {/* Card 1: Solid Brand Red */}
                        <div className="bg-[#E61E32] rounded-[24px] p-8 flex flex-col items-center justify-between aspect-square shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden group">
                            <span className="text-white/50 font-mono text-[9px] uppercase tracking-wider self-start">
                                Brand Primary
                            </span>
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Redlix Logo"
                                    className="max-w-[150px] object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-white/80 font-mono text-[10px] uppercase tracking-wider text-center">
                                &lt; Scaling Businesses with AI /&gt;
                            </span>
                        </div>

                        {/* Card 2: Blueprint Redlix Grid */}
                        <div 
                            className="bg-[#E61E32] rounded-[24px] p-8 flex flex-col items-center justify-between aspect-square shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden group bg-cover bg-center"
                            style={{
                                backgroundImage: "linear-gradient(to bottom, rgba(230, 30, 50, 0.95), rgba(230, 30, 50, 0.95)), url('https://ik.imagekit.io/dypkhqxip/sketch01')",
                            }}
                        >
                            <span className="text-white/50 font-mono text-[9px] uppercase tracking-wider self-start">
                                Technical Blueprint
                            </span>
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Redlix Logo Grid"
                                    className="max-w-[150px] object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-white/80 font-mono text-[10px] uppercase tracking-wider text-center">
                                &lt; Product Engineering /&gt;
                            </span>
                        </div>

                        {/* Card 3: Dark Pagination Card */}
                        <div 
                            className="bg-[#1E2022] rounded-[24px] p-8 flex flex-col items-center justify-between aspect-square shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden group bg-cover bg-center"
                            style={{
                                backgroundImage: "linear-gradient(to bottom, rgba(30, 32, 34, 0.95), rgba(30, 32, 34, 0.95)), url('https://ik.imagekit.io/dypkhqxip/sketch01')",
                            }}
                        >
                            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider self-start">
                                Developer Ecosystem
                            </span>
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                    alt="Redlix Dark Logo"
                                    className="max-w-[150px] object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex items-center gap-2.5 text-zinc-600 font-mono text-xs select-none">
                                <span className="text-[10px]">○</span>
                                <span className="text-[11px] cursor-pointer hover:text-white transition-colors">◀</span>
                                <span className="text-[10px] text-[#E61E32]">■</span>
                                <span className="text-[11px] cursor-pointer hover:text-white transition-colors">▶</span>
                                <span className="text-[10px]">○</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Section: Color Palette (Showcase style) */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-full border-t border-dashed border-zinc-200/80 mb-6" />
                        <h2 className="text-lg sm:text-[20px] text-zinc-600 leading-relaxed font-normal max-w-xl">
                            The <span className="font-bold text-zinc-900">Redlix palette</span> that reflects <br />
                            momentum, intelligent technology, and precision
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-6" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto text-left">
                        {brandColors.map((color) => (
                            <div
                                key={color.hex}
                                onClick={() => handleCopy(color.hex)}
                                className="bg-white border border-zinc-200/80 rounded-[28px] p-4 flex flex-col gap-4 hover:scale-[1.02] hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] cursor-pointer relative group"
                            >
                                <div 
                                    className="rounded-[20px] aspect-[4/5] w-full relative overflow-hidden border border-zinc-200/30 shadow-inner flex items-center justify-center" 
                                    style={{ 
                                        backgroundColor: color.hex,
                                        backgroundImage: color.hex === "#FFFFFF" ? "radial-gradient(#e4e4e7 1px, transparent 1px)" : "none",
                                        backgroundSize: color.hex === "#FFFFFF" ? "12px 12px" : "auto"
                                    }}
                                >
                                    {/* Glassmorphic overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white">
                                        {copiedColor === color.hex ? (
                                            <>
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-[10px] font-bold tracking-wider text-emerald-400">COPIED!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                                <span className="text-[10px] font-bold tracking-wider text-white/90">COPY HEX</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="px-1 pb-1 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-zinc-900 font-bold text-[14px] mb-0.5">{color.name}</h3>
                                        <p className="text-zinc-400 text-[11px] font-mono font-medium">{color.hex}</p>
                                    </div>
                                    <div className="text-zinc-300 group-hover:text-zinc-500 transition-colors duration-200">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Typography (Showcase style) */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <div className="w-full border-t border-dashed border-zinc-200/80 mb-6" />
                        <h2 className="text-lg sm:text-[20px] text-zinc-600 leading-relaxed font-normal">
                            <span className="font-bold text-zinc-900">Typography System</span> that reflects accessibility and engineering precision
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-6" />
                    </div>

                    <div className="max-w-4xl mx-auto flex flex-col gap-16 text-left">
                        
                        {/* 1. Poppins Typeface (Headings & Display) */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                                <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                                    Typeface 01 — Titles, Headings, and Display Actions
                                </span>
                                <span className="bg-[#E61E32]/10 text-[#E61E32] px-2.5 py-0.5 rounded text-[11px] font-bold font-mono">
                                    Poppins (Google Fonts)
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Side: Details & Usage */}
                                <div className="lg:col-span-7 flex flex-col">
                                    <h3 className="text-[44px] sm:text-[52px] font-bold text-zinc-950 font-sans tracking-tight leading-none mb-4">
                                        Poppins
                                    </h3>
                                    <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-6">
                                        Poppins is our primary sans-serif display typeface. It is configured across all hero headings, section titles, page headers, navigation tabs, and primary actions. Its geometric structure delivers high legibility and a modern, confident brand voice.
                                    </p>
                                    
                                    {/* Usage Guideline Box */}
                                    <div className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-xl mb-4">
                                        <h5 className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider mb-1.5">Usage Guideline</h5>
                                        <p className="text-[12.5px] text-zinc-500 leading-relaxed">
                                            Apply for Display sizes (H1-H4) and active buttons. Use <strong>SemiBold (600)</strong> or <strong>Bold (700)</strong> for main weight, and <strong>Light (300)</strong> or <strong>Regular (400)</strong> for taglines and summaries.
                                        </p>
                                    </div>

                                    {/* Preview Block */}
                                    <div className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-xl">
                                        <h5 className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider mb-2">Example Preview</h5>
                                        <h4 className="text-[20px] font-medium text-zinc-950 font-sans tracking-tight leading-tight">
                                            Sleek IT solutions for growing brands.
                                        </h4>
                                    </div>
                                </div>

                                {/* Right Side: Weights Grid */}
                                <div className="lg:col-span-5 grid grid-cols-2 gap-y-6 gap-x-4 bg-zinc-50/50 border border-zinc-200/60 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-normal text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-medium">Regular</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 400</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-medium text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-medium">Medium</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 500</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-semibold text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-medium">SemiBold</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 600</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-bold text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-medium">Bold</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 700</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-zinc-200/50">
                                        <span className="font-mono text-zinc-400 text-[10.5px] block leading-tight">
                                            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                                            abcdefghijklmnopqrstuvwxyz<br />
                                            0123456789 !@#$%^&*()
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider between typefaces */}
                        <div className="h-[1px] w-full bg-zinc-100" />

                        {/* 2. Geist Mono Typeface (Technical / Details) */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                                <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                                    Typeface 02 — Code, Statistics, and Technical Data Details
                                </span>
                                <span className="bg-zinc-900 text-zinc-300 px-2.5 py-0.5 rounded text-[11px] font-bold font-mono">
                                    Geist Mono (Vercel)
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Side: Details & Usage */}
                                <div className="lg:col-span-7 flex flex-col">
                                    <h3 className="text-[40px] sm:text-[48px] font-bold text-zinc-950 font-mono tracking-tight leading-none mb-4">
                                        Geist Mono
                                    </h3>
                                    <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-6">
                                        Geist Mono is our auxiliary monospace typeface. It is strictly reserved for technical contexts such as terminal mockups, database values, statistics counters, timeline logs, and legal/license documentation pages.
                                    </p>
                                    
                                    {/* Usage Guideline Box */}
                                    <div className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-xl mb-4">
                                        <h5 className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider mb-1.5">Usage Guideline</h5>
                                        <p className="text-[12.5px] text-zinc-500 leading-relaxed">
                                            Apply for code elements, inline hex descriptors, timestamps, and parameters. Use <strong>Regular (400)</strong> or <strong>Medium (500)</strong> weights for standard readouts to prevent visual crowding.
                                        </p>
                                    </div>

                                    {/* Preview Block */}
                                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 font-mono">Example Render</h5>
                                        <code className="text-[13px] text-emerald-400 font-mono leading-relaxed block">
                                            $ npm run build<br />
                                            ✓ Compiled successfully in 3.8s (Turbopack)
                                        </code>
                                    </div>
                                </div>

                                {/* Right Side: Weights Grid */}
                                <div className="lg:col-span-5 grid grid-cols-2 gap-y-6 gap-x-4 bg-zinc-50/50 border border-zinc-200/60 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-normal text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-mono font-medium">Regular</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 400</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-medium text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-mono font-medium">Medium</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 500</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-semibold text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-mono font-medium">SemiBold</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 600</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[28px] font-bold text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[12.5px] font-mono font-medium">Bold</span>
                                            <span className="text-zinc-400 text-[10px] font-mono">Weight: 700</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-zinc-200/50">
                                        <span className="font-mono text-zinc-400 text-[10.5px] block leading-tight">
                                            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                                            abcdefghijklmnopqrstuvwxyz<br />
                                            0123456789 !@#$%^&*()
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Brand Asset Copyright & Usage Notice */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-full border-t border-dashed border-zinc-200/80 mb-6" />
                        <h2 className="text-lg sm:text-[19px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                            Brand Assets Usage & Copyright Guidelines
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-2" />
                    </div>

                    <div className="max-w-3xl mx-auto bg-zinc-50/50 border border-zinc-200/60 p-6 sm:p-8 rounded-[28px] text-zinc-500 text-[13.5px] leading-relaxed flex flex-col gap-4 text-left">
                        <p>
                            All brand assets downloaded from this page, including the Redlix Studio glyphs, wordmarks, logotypes, color palettes, and typographic assets, are the exclusive intellectual property of Redlix Studio. They are protected by local and international copyright and trademark laws.
                        </p>
                        <p>
                            <strong>Allowed Usage:</strong> You are granted a non-exclusive, non-transferable, revocable license to download and use these brand assets solely for the purpose of representing, reviewing, referencing, or linking to Redlix Studio in approved media publications, partner portfolios, or client integrations.
                        </p>
                        <p>
                            <strong>Strict Prohibitions:</strong> You may not modify the shape, geometry, proportions, or colors of the logos (outside of the authorized color palette options provided above). You may not use these assets in any way that implies endorsement, sponsorship, or affiliation with Redlix Studio without prior written consent, nor use them in any materials that misrepresent or damage the brand's reputation.
                        </p>
                        <p className="font-mono text-zinc-400 text-[11.5px] mt-2 text-center">
                            © 2026 Redlix Studio. All rights reserved.
                        </p>
                    </div>
                </div>

            </div>

            <CorporateFooter />
        </div>
    );
}
