import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "InfraManager Pro",
  description: "Infrastructure Management Console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
