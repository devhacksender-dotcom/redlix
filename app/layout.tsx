import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScrolling from "@/components/SmoothScrolling";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Analytics } from "@vercel/analytics/next";
import ConditionalNav from "@/components/ConditionalNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://redlix.co.in"),
  title: {
    default: "Redlix Studio | Independent Freelance Studio & IT Solutions",
    template: "%s | Redlix Studio"
  },
  description: "Redlix Studio is a premier independent freelance studio specializing in expert IT services and high-performance digital solutions based in Hyderabad, India.",
  keywords: [
    "Redlix Studio",
    "IT Services Hyderabad",
    "Freelance Studio Hyderabad",
    "Enterprise Software Solutions",
    "Custom IT Infrastructure",
    "B2B Software Development",
    "Digital Transformation Agency",
    "Independent Development Studio",
    "Freelance Developer Hyderabad",
    "Next.js Developer India",
    "Full-stack Engineer Hyderabad",
    "Software Studio Hyderabad",
    "Web App Development Hyderabad",
    "Supabase PostgreSQL Developer Hyderabad"
  ],
  authors: [{ name: "Rishi Rohan Kalapala" }],
  creator: "Rishi Rohan Kalapala",
  publisher: "Redlix Studio",
  category: "technology",
  classification: "B2B Software Development & Freelance IT Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://redlix.co.in",
    siteName: "Redlix Studio",
    title: "Redlix Studio | Independent Freelance Studio & IT Solutions",
    description: "Expert IT services and elite digital solutions engineered for high-performance enterprise growth.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Redlix Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Redlix Studio | IT Solutions",
    description: "Empowering businesses with elite freelance IT services and digital solutions.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.385044;78.486671",
    "ICBM": "17.385044, 78.486671"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R7PSZ5VMX8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent levels for EEA compliance
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });

            gtag('js', new Date());
            gtag('config', 'G-R7PSZ5VMX8');
          `}
        </Script>
        <Script
          src="https://www.google.com/recaptcha/enterprise.js"
          strategy="afterInteractive"
          async
          defer
        />
      </head>
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrolling>
          <ConditionalNav>
            {children}
          </ConditionalNav>
          <Analytics />
        </SmoothScrolling>
      </body>
    </html>
  );
}
