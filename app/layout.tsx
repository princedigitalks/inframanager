import type { Metadata } from "next";
import "../src/index.css";
import AppLayout from "@/src/AppLayout";

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
      <body suppressHydrationWarning>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
