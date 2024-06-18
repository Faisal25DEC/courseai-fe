import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import RecoilProvider from "@/components/providers/RecoilProvider";
import { Toaster } from "sonner";
import CreateLessonModal from "./(courses-create)/courses/create/_components/create-lesson-modal/create-lesson-modal";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseAI",
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
            <Toaster closeButton />
            <Navbar />
            {children}
          </RecoilProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
