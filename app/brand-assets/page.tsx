"use client";

import React from "react";
import Link from "next/link";
import CorporateFooter from "@/components/CorporateFooter";
import { XCircle } from "lucide-react";

export default function BrandAssetsPage() {


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
            <div className="w-full bg-zinc-50/40 backdrop-blur-[2px] border-b border-dashed border-zinc-200/80 pt-24 pb-16 sm:py-20 lg:py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
                        {/* Left Column: Right-aligned description */}
                        <div className="text-center md:text-right">
                            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-light text-zinc-800 leading-[1.35] tracking-tight">
                                The <span className="font-bold text-zinc-950">Redlix logo</span> is <br />
                                intelligent technology <br />
                                and scalable engineering
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
                                The clean, geometric build of the <span className="font-medium text-zinc-800">Redlix mark</span> highlights our dedication to precision, scaling modern businesses with seamless AI integrations and custom developer ecosystems.
                            </p>
                            <p>
                                At its core, the vibrant primary red color reflects energy, momentum, and our commitment to driving continuous digital transformation for global brands.
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
                        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - Red"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* 2. Charcoal Black */}
                        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - Black"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* 3. Slate Dark */}
                        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - Slate"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 opacity-60 group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* 4. White on Black */}
                        <div className="bg-zinc-950 border border-zinc-900 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/logo__1_"
                                alt="Redlix Glyph - White"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                            />
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
                        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - Red"
                                className="max-w-full max-h-[36px] object-contain group-hover:scale-105 transition-transform duration-300"
                                style={{ filter: "brightness(0) saturate(100%) invert(24%) sepia(86%) saturate(6382%) hue-rotate(349deg) brightness(97%) contrast(92%)" }}
                            />
                        </div>

                        {/* 2. Charcoal Black */}
                        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - Black"
                                className="max-w-full max-h-[36px] object-contain brightness-0 group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* 3. Slate Dark */}
                        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - Slate"
                                className="max-w-full max-h-[36px] object-contain brightness-0 opacity-60 group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* 4. White on Black */}
                        <div className="bg-zinc-950 border border-zinc-900 rounded-[24px] aspect-square flex items-center justify-center p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Inline - White"
                                className="max-w-full max-h-[36px] object-contain group-hover:scale-105 transition-transform duration-300"
                            />
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
                        {/* 1. Redlix Red */}
                        <div className="bg-white border border-zinc-200/80 rounded-[28px] p-4 flex flex-col gap-4 hover:scale-[1.02] hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                            <div className="bg-[#E61E32] rounded-[20px] aspect-[4/5] w-full" />
                            <div className="px-1 pb-1">
                                <h3 className="text-zinc-900 font-bold text-[15px] mb-0.5">Redlix Red</h3>
                                <p className="text-zinc-400 text-[12.5px] font-mono font-medium">#E61E32</p>
                            </div>
                        </div>

                        {/* 2. White */}
                        <div className="bg-white border border-zinc-200/80 rounded-[28px] p-4 flex flex-col gap-4 hover:scale-[1.02] hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                            <div className="bg-white border border-zinc-200/60 rounded-[20px] aspect-[4/5] w-full [background-image:radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:12px_12px]" />
                            <div className="px-1 pb-1">
                                <h3 className="text-zinc-900 font-bold text-[15px] mb-0.5">White</h3>
                                <p className="text-zinc-400 text-[12.5px] font-mono font-medium">#FFFFFF</p>
                            </div>
                        </div>

                        {/* 3. Slate Dark */}
                        <div className="bg-white border border-zinc-200/80 rounded-[28px] p-4 flex flex-col gap-4 hover:scale-[1.02] hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                            <div className="bg-[#1E2022] rounded-[20px] aspect-[4/5] w-full" />
                            <div className="px-1 pb-1">
                                <h3 className="text-zinc-900 font-bold text-[15px] mb-0.5">Slate Dark</h3>
                                <p className="text-zinc-400 text-[12.5px] font-mono font-medium">#1E2022</p>
                            </div>
                        </div>

                        {/* 4. Charcoal Black */}
                        <div className="bg-white border border-zinc-200/80 rounded-[28px] p-4 flex flex-col gap-4 hover:scale-[1.02] hover:border-zinc-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                            <div className="bg-[#070809] rounded-[20px] aspect-[4/5] w-full" />
                            <div className="px-1 pb-1">
                                <h3 className="text-zinc-900 font-bold text-[15px] mb-0.5">Charcoal Black</h3>
                                <p className="text-zinc-400 text-[12.5px] font-mono font-medium">#070809</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Typography (Showcase style) */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <div className="w-full border-t border-dashed border-zinc-200/80 mb-6" />
                        <h2 className="text-lg sm:text-[19px] text-zinc-600 leading-relaxed font-normal">
                            <span className="font-bold text-zinc-900">Typography</span> that reflects accessibility and growth
                        </h2>
                        <div className="w-full border-t border-dashed border-zinc-200/80 mt-6" />
                    </div>

                    <div className="max-w-4xl mx-auto flex flex-col gap-16 text-left">
                        {/* 1. Poppins Typeface (Headings & Body) */}
                        <div className="flex flex-col gap-6">
                            <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                                Typeface - Titles, Headings, Subheadings, and Headlines
                            </span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Left Side: Large Font Details */}
                                <div className="flex flex-col">
                                    <h3 className="text-[48px] sm:text-[60px] font-bold text-zinc-950 font-sans tracking-tight leading-none mb-6">
                                        Poppins
                                    </h3>
                                    <div className="font-mono text-zinc-400 text-[13px] leading-relaxed tracking-wider">
                                        <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                                        <p>abcdefghijklmnopqrstuvwxyz0123456789</p>
                                        <p>!@#$%^&*()</p>
                                    </div>
                                </div>

                                {/* Right Side: Weights Grid */}
                                <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-normal text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium">Regular</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 400</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-medium text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium">Medium</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 500</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-semibold text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium">SemiBold</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 600</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-bold text-zinc-950 font-sans">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium">Bold</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 700</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider between typefaces */}
                        <div className="h-[1px] w-full bg-zinc-100" />

                        {/* 2. Geist Mono Typeface (Technical / Code Copy) */}
                        <div className="flex flex-col gap-6">
                            <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                                Typeface - Body Copy & Technical details
                            </span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Left Side: Large Font Details */}
                                <div className="flex flex-col">
                                    <h3 className="text-[44px] sm:text-[54px] font-bold text-zinc-950 font-mono tracking-tight leading-none mb-6">
                                        Geist Mono
                                    </h3>
                                    <div className="font-mono text-zinc-400 text-[13px] leading-relaxed tracking-wider">
                                        <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                                        <p>abcdefghijklmnopqrstuvwxyz0123456789</p>
                                        <p>!@#$%^&*()</p>
                                    </div>
                                </div>

                                {/* Right Side: Weights Grid */}
                                <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-normal text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium font-mono">Regular</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 400</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-medium text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium font-mono">Medium</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 500</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-semibold text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium font-mono">SemiBold</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 600</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[36px] font-bold text-zinc-950 font-mono">Aa</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-800 text-[13.5px] font-medium font-mono">Bold</span>
                                            <span className="text-zinc-400 text-[11.5px] font-mono">Font Weight: 700</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CorporateFooter />
        </div>
    );
}
