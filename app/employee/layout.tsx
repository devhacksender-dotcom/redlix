import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#E61E32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Redlix Employee Portal",
  description: "Redlix Studio employee dashboard — manage tasks, attendance, payroll and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Redlix Portal",
  },
  icons: {
    apple: "https://ik.imagekit.io/dypkhqxip/logo.png",
    icon: [
      { url: "https://ik.imagekit.io/dypkhqxip/logo.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Register service worker */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker
                  .register('/sw.js', { scope: '/employee' })
                  .then(function (reg) {
                    console.log('[Redlix PWA] Service worker registered:', reg.scope);
                  })
                  .catch(function (err) {
                    console.warn('[Redlix PWA] Service worker registration failed:', err);
                  });
              });
            }
          `,
        }}
      />
      {children}
    </>
  );
}
