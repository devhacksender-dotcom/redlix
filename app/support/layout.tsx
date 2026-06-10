import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Get in touch with Redlix Studio support for technical inquiries, portal assistance, and general help.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
