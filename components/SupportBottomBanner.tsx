"use client";

import React from "react";
import Image from "next/image";

const BottomBanner = () => {
  return (
    <footer className="w-full bg-[#E61E32] border-t border-[#CC192A]/30 py-8 pb-14 md:pb-8 font-sans">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-[11px] font-medium">
                Support infrastructure
              </span>
              <div className="flex items-center gap-4">
                <Image
                  src="https://ik.imagekit.io/dypkhqxip/logo.png"
                  alt="Support Logo"
                  width={40}
                  height={40}
                  className="h-9 w-auto brightness-0 invert"
                />
                <div className="h-4 w-[1px] bg-white/20" />
                <Image
                  src="https://ik.imagekit.io/dypkhqxip/redlixlogo"
                  alt="Redlix Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
            </div>

            <div className="hidden sm:block h-5 w-[1px] bg-white/20" />

            <div className="flex items-center gap-2.5 text-white/80">
              <span className="text-[12px] font-medium tracking-wide">
                Intern support unit • © 2026 Redlix Studio
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            <a
              href="https://redlix.co.in/support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 text-[13px] font-medium rounded-none shadow-md"
            >
              Help & support
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default BottomBanner;