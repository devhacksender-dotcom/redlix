import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
    apple: "/icons/apple-touch-icon.png",
    icon: "/icons/icon-192.png",
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
