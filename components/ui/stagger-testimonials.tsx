"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

// Re-integrated 8 original testimonials with custom soft pastel colors and border shades.
const testimonials = [
  {
    tempId: 0,
    testimonial: "An incredible collaboration. Redlix was professional, highly responsive, and transformed our vision into a beautiful, functional platform.",
    by: "NSS CMRIT, Student Chapter",
    imgSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/National_Service_Scheme_logo.svg/1280px-National_Service_Scheme_logo.svg.png",
    bgColor: "#f5f3ff", // Soft Lavender
    borderColor: "#ddd6fe"
  },
  {
    tempId: 1,
    testimonial: "Our user engagement doubled since launch. The clean design, fast loading, and intuitive experience transformed how members interact.",
    by: "Jaswanth Sonti, Founder at Student Forge",
    imgSrc: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184951/Screenshot_2026-02-16_at_01.18.59_yodn7t.png",
    bgColor: "#f0fdf4", // Soft Mint
    borderColor: "#bbf7d0"
  },
  {
    tempId: 2,
    testimonial: "The precision engineering and attention to detail in our platform is remarkable. It handles complex student management seamlessly.",
    by: "HSGA CMRIT, HSGA Chapter",
    imgSrc: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    bgColor: "#fffbeb", // Soft Amber
    borderColor: "#fde68a"
  },
  {
    tempId: 6,
    testimonial: "An exceptional education platform for IELTS and Spoken English. Redlix created a highly engaging and modern learning system for our students.",
    by: "Polyglot, Education Platform",
    imgSrc: "https://ik.imagekit.io/dypkhqxip/polyglot",
    bgColor: "#f0f4ff", // Soft Indigo
    borderColor: "#c7d2fe"
  },
  {
    tempId: 3,
    testimonial: "Working with Redlix was a total game-changer. They built a custom client system that streamlined operations and saved us hours of manual effort.",
    by: "Dhanush Reddy, Founder at Dhasha Media",
    imgSrc: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770931011/Screenshot_2026-02-13_at_02.45.59_kw8pih.png",
    bgColor: "#fff1f2", // Soft Rose (matches Brand Red)
    borderColor: "#fecdd3"
  },
  {
    tempId: 4,
    testimonial: "An exceptional partner. Redlix took the time to understand our goals and delivered a solution exceeding expectations in every way.",
    by: "Harshith Sai Tunguntla, CEO at SAS",
    imgSrc: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184658/Screenshot_2026-02-16_at_01.14.02_btxipo.png",
    bgColor: "#ecfeff", // Soft Cyan
    borderColor: "#cffafe"
  },
  {
    tempId: 7,
    testimonial: "Paverasa Private Limited sincerely thanks Redlix for developing PicsiDrop. Their technical expertise and commitment transformed our vision into a reliable, user-friendly platform.",
    by: "Pavan Reddy, Paverasa Pvt. Ltd.",
    imgSrc: "https://ik.imagekit.io/dypkhqxip/Pavan%20Reddy%20Pateel?updatedAt=1780238997511",
    bgColor: "#fff7ed", // Soft Peach
    borderColor: "#fed7aa"
  },
  {
    tempId: 5,
    testimonial: "Redlix delivered a modern, fast, accessible digital platform. Their attention to detail and performance was truly exceptional.",
    by: "HSGA Telangana, Government Infrastructure",
    imgSrc: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    bgColor: "#eff6ff", // Soft Slate Blue
    borderColor: "#dbeafe"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardWidth: number;
  cardHeight: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardWidth,
  cardHeight
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-7 sm:p-8 transition-all duration-500 ease-in-out select-none",
        isCenter
          ? "z-10 text-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
          : "z-0 text-zinc-500 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
      )}
      style={{
        width: cardWidth,
        height: cardHeight,
        backgroundColor: testimonial.bgColor,
        borderColor: testimonial.borderColor,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardWidth / 1.45) * position}px)
          translateY(${isCenter ? -45 : position % 2 ? 10 : -10}px)
          rotate(${isCenter ? 0 : position % 2 ? 2 : -2}deg)
        `,
        boxShadow: isCenter ? "0px 10px 0px 0px #ef4444" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          backgroundColor: testimonial.borderColor
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        suppressHydrationWarning
        referrerPolicy="no-referrer"
        className="mb-4 h-14 w-14 shrink-0 bg-zinc-100/50 object-cover object-top rounded-lg border border-zinc-200 shadow-[2px_2px_0px_rgba(0,0,0,0.04)]"
      />
      <h3 className={cn(
        "text-[14px] sm:text-[16px] font-medium leading-relaxed tracking-tight",
        isCenter ? "text-zinc-950 font-semibold" : "text-zinc-700"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-7 sm:bottom-8 left-7 sm:left-8 right-7 sm:right-8 mt-2 text-[12px] sm:text-[13px] italic font-medium",
        isCenter ? "text-zinc-500" : "text-zinc-400"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardWidth, setCardWidth] = useState(350);
  const [cardHeight, setCardHeight] = useState(400);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardWidth(matches ? 350 : 280);
      setCardHeight(matches ? 400 : 330);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-zinc-50/50"
      style={{ height: 500 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-11 w-11 items-center justify-center transition-all cursor-pointer rounded-none border border-zinc-200 bg-white text-zinc-600 shadow-sm",
            "hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 active:bg-zinc-100",
            "focus-visible:outline-none"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-11 w-11 items-center justify-center transition-all cursor-pointer rounded-none border border-zinc-200 bg-white text-zinc-600 shadow-sm",
            "hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 active:bg-zinc-100",
            "focus-visible:outline-none"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
