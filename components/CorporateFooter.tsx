import React from "react";
import Link from "next/link";
import {
    FacebookIcon,
    GithubIcon,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon
} from "lucide-react";
import { CommitsGrid } from "@/components/ui/commits-grid";

export default function CorporateFooter() {
    const year = new Date().getFullYear();

    const company = [
        {
            title: "About Us",
            href: "/about-us",
        },
        {
            title: "Careers",
            href: "/careers",
        },
        {
            title: "Brand assets",
            href: "/brand",
        },
        {
            title: "Privacy Policy",
            href: "/privacy",
        },
        {
            title: "Terms of Service",
            href: "/terms",
        },
    ];

    const resources = [
        {
            title: "Blog",
            href: "/resources",
        },
        {
            title: "Help Center",
            href: "/support",
        },
        {
            title: "Contact Support",
            href: "mailto:help.ckrdatapoint@gmail.com",
        },
        {
            title: "Community",
            href: "#",
        },
        {
            title: "Security",
            href: "#",
        },
    ];

    const socialLinks = [
        {
            icon: <FacebookIcon className="size-4" />,
            link: "#",
        },
        {
            icon: <GithubIcon className="size-4" />,
            link: "#",
        },
        {
            icon: <InstagramIcon className="size-4" />,
            link: "#",
        },
        {
            icon: <LinkedinIcon className="size-4" />,
            link: "#",
        },
        {
            icon: <TwitterIcon className="size-4" />,
            link: "#",
        },
        {
            icon: <YoutubeIcon className="size-4" />,
            link: "#",
        },
    ];

    return (
        <footer className="relative w-full bg-[#0C0D0E] text-zinc-400 pt-16 pb-12 border-t border-zinc-900 font-sans">
            <div className="mx-auto max-w-4xl px-4">
                <div className="grid max-w-4xl grid-cols-6 gap-6 pb-8">
                    <div className="col-span-6 flex flex-col gap-5 md:col-span-4 text-left">
                        {/* Redlix Logo */}
                        <Link href="/" className="group w-max inline-block">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlixlogo?updatedAt=1777318254456"
                                alt="Redlix Logo"
                                className="h-[36px] w-auto brightness-0 invert opacity-95 transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </Link>
                        <p className="text-zinc-500 max-w-sm font-mono text-sm text-balance">
                            Web design, product engineering, and custom software from Redlix Studio.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((item, i) => (
                                <a
                                    key={i}
                                    className="hover:bg-zinc-800 rounded-md border border-zinc-800 p-1.5 transition-colors"
                                    target="_blank"
                                    href={item.link}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3 w-full md:col-span-1 text-left">
                        <span className="text-zinc-500 mb-2.5 text-xs block uppercase tracking-wider font-semibold">
                            Resources
                        </span>
                        <div className="flex flex-col gap-1.5">
                            {resources.map(({ href, title }, i) => (
                                <Link
                                    key={i}
                                    className="w-max py-1 text-sm text-zinc-400 duration-200 hover:text-white hover:underline"
                                    href={href}
                                >
                                    {title}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3 w-full md:col-span-1 text-left">
                        <span className="text-zinc-500 mb-2.5 text-xs block uppercase tracking-wider font-semibold">
                            Company
                        </span>
                        <div className="flex flex-col gap-1.5">
                            {company.map(({ href, title }, i) => (
                                <Link
                                    key={i}
                                    className="w-max py-1 text-sm text-zinc-400 duration-200 hover:text-white hover:underline"
                                    href={href}
                                >
                                    {title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-zinc-900 my-6" />

                <div className="flex flex-col items-center gap-6 select-none">
                    <p className="text-zinc-500 text-center text-sm font-normal">
                        Redlix &copy; {year} All Rights Reserved
                    </p>
                    <div className="w-full max-w-md flex justify-center opacity-85 hover:opacity-100 transition-opacity duration-300">
                        <CommitsGrid text="REDLIX" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
