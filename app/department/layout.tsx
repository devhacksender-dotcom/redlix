import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department Portal",
  description: "Redlix Studio department operations portal.",
};

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
