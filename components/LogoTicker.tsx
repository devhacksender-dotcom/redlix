import React from "react";

const uniqueLogos = [
    {
        src: "https://ik.imagekit.io/dypkhqxip/Polyglot%20logo%20new%20(1).png?updatedAt=1779454548832",
        alt: "Polyglot Logo",
        useFilter: true
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/picsihoriz?updatedAt=1778919009480",
        alt: "PisciDrop Logo",
        useFilter: true
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/smartfitai",
        alt: "SmartFitAI Logo",
        useFilter: true
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
        alt: "Student Forge Logo",
        useFilter: true
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/WhatsApp_Image_2026-05-22_at_16.50.47-removebg-preview.png",
        alt: "Shraddha Logo",
        useFilter: true // Disable filter to keep it visible (since JPEGs turn into a solid black box with brightness-0)
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/the%20fli%20(1).png",
        alt: "The Fli Logo",
        useFilter: true,
        customClass: "h-[65px] md:h-[72px]" // Increase size
    }
];

// Repeat the unique logos 4 times to ensure the group width is wider than the screen.
// This guarantees a perfectly seamless, gap-free marquee loop on all screen sizes.
const logos = [...uniqueLogos, ...uniqueLogos, ...uniqueLogos, ...uniqueLogos];

export default function LogoTicker() {
    return (
        <section className="w-full bg-white py-12 border-b border-gray-100 overflow-hidden">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] md:text-[12px] text-zinc-400 font-medium tracking-wider mb-6 text-center uppercase select-none">
                        Powering fast-moving tech companies & governments
                    </p>

                    <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-white after:to-transparent">
                        <div className="flex gap-10 md:gap-14 animate-marquee py-2 select-none items-center">

                            {/* Slide Group 1 */}
                            <div className="flex items-center gap-10 md:gap-14 flex-shrink-0">
                                {logos.map((logo, index) => (
                                    <div key={`g1-${index}`} className="flex items-center group cursor-pointer">
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            className={`${logo.customClass || "h-[32px] md:h-[38px]"} w-auto ${logo.useFilter ? "filter brightness-0 opacity-55 group-hover:opacity-95" : "opacity-80 group-hover:opacity-100"} transition-all duration-300 object-contain`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Slide Group 2 (Duplicate for infinite seamless scroll) */}
                            <div className="flex items-center gap-10 md:gap-14 flex-shrink-0">
                                {logos.map((logo, index) => (
                                    <div key={`g2-${index}`} className="flex items-center group cursor-pointer">
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            className={`${logo.customClass || "h-[32px] md:h-[38px]"} w-auto ${logo.useFilter ? "filter brightness-0 opacity-55 group-hover:opacity-95" : "opacity-80 group-hover:opacity-100"} transition-all duration-300 object-contain`}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
