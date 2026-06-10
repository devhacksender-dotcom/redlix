import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intern Support",
  description: "Redlix Studio Intern Support Unit portal. Report developer terminal issues and submit support requests.",
};

export default function InternSupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
