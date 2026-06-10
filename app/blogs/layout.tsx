import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description: "Read the latest engineering insights, software architecture deep dives, and articles from Redlix Studio.",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
