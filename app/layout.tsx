import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import RecoilProvider from "@/components/providers/RecoilProvider";
import { Toaster } from "sonner";
import CreateLessonModal from "./(courses-create)/courses/create-lesson/_components/create-lesson-modal/create-lesson-modal";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import SidebarComponent from "@/components/shared/sidebar/sidebar-container";

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
              <div className="flex">
                <div className="fixed top-0 left-0 h-full w-fit z-10">
                  <SidebarComponent />
                </div>
                <div className="ml-64 flex-1">{children}</div>
              </div>
            </NextUIProvider>
          </RecoilProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
