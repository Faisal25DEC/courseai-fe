import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RecoilProvider from "@/components/providers/RecoilProvider";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import ClientRootLayout from "./ClientRootLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Permian",
  description: "Create impactful courses powered by AI",
  icons: {
    icon: [{ url: "/logo.png", href: "/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <RecoilProvider>
            <NextUIProvider>
              <Toaster closeButton />
              <ClientRootLayout>{children}</ClientRootLayout>
            </NextUIProvider>
          </RecoilProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
