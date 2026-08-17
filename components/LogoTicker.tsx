import React from "react";

const uniqueLogos = [
    {
        src: "https://ik.imagekit.io/dypkhqxip/WhatsApp_Image_2026-05-22_at_16.50.47-removebg-preview.png",
        alt: "Shraddha Logo",
        height: "36px"
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/the%20fli%20(1).png",
        alt: "The Fli Logo",
        height: "56px"
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/Polyglot%20logo%20new%20(1).png?updatedAt=1779454548832",
        alt: "Polyglot Logo",
        height: "38px"
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/picsihoriz?updatedAt=1778919009480",
        alt: "PisciDrop Logo",
        height: "38px"
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/smartfitai",
        alt: "SmartFitAI Logo",
        height: "36px"
    },
    {
        src: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
        alt: "Student Forge Logo",
        height: "38px"
    }
];

// Repeat the unique logos 4 times to ensure the group width is wider than the screen.
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
                                    <div key={`g1-${index}`} className="flex items-center justify-center group cursor-pointer flex-shrink-0">
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            style={{
                                                height: logo.height || "36px",
                                                maxHeight: "60px",
                                                width: "auto",
                                                objectFit: "contain",
                                                filter: "grayscale(100%) brightness(0.4)",
                                                opacity: 0.65
                                            }}
                                            className="transition-all duration-300 group-hover:opacity-100 group-hover:brightness-50 object-contain"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Slide Group 2 (Duplicate for infinite seamless scroll) */}
                            <div className="flex items-center gap-10 md:gap-14 flex-shrink-0">
                                {logos.map((logo, index) => (
                                    <div key={`g2-${index}`} className="flex items-center justify-center group cursor-pointer flex-shrink-0">
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            style={{
                                                height: logo.height || "36px",
                                                maxHeight: "60px",
                                                width: "auto",
                                                objectFit: "contain",
                                                filter: "grayscale(100%) brightness(0.4)",
                                                opacity: 0.65
                                            }}
                                            className="transition-all duration-300 group-hover:opacity-100 group-hover:brightness-50 object-contain"
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