import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Assets",
  description: "Official brand assets, logos, typography, colors, and design guidelines for Redlix Studio.",
};

export default function BrandAssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
