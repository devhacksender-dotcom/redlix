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
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
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
                // Clean up any old sub-scoped service workers to prevent conflicts
                navigator.serviceWorker.getRegistrations().then(function (registrations) {
                  for (let reg of registrations) {
                    if (reg.scope.includes('/employee')) {
                      reg.unregister().then(function() {
                        console.log('[Redlix PWA] Unregistered sub-scoped service worker:', reg.scope);
                      });
                    }
                  }
                });

                navigator.serviceWorker
                  .register('/sw.js')
                  .then(function (reg) {
                    console.log('[Redlix PWA] Root service worker registered:', reg.scope);
                  })
                  .catch(function (err) {
                    console.warn('[Redlix PWA] Root service worker registration failed:', err);
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
