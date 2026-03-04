import type { Metadata } from "next";
import "../src/index.css";
import ReduxProvider from "@/src/store/ReduxProvider";
import AuthGuard from "@/src/AuthGuard";
import ConditionalLayout from "@/src/ConditionalLayout";

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
        <ReduxProvider>
          <AuthGuard>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthGuard>
        </ReduxProvider>
      </body>
    </html>
  );
}
