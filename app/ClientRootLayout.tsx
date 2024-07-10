"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const shouldShowSidebar = !pathname.startsWith("/video");

  return (
    <div className="flex">
      <SignedIn>
        {shouldShowSidebar && (
          <div className="fixed top-0 left-0 h-full w-fit z-10">
            <Sidebar />
          </div>
        )}
        <div className={shouldShowSidebar ? "ml-64 flex-1" : "flex-1"}>
          {children}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex-1">{children}</div>
      </SignedOut>
    </div>
  );
};

export default ClientRootLayout;
