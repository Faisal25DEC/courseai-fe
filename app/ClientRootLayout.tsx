"use client";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentUserRoleAtom, onBoardingQuestionsAtom } from "@/store/atoms";
import { admin, member } from "@/lib/constants";

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();

  const shouldShowSidebar = !(
    pathname.startsWith("/onboarding-flow") ||
    pathname.startsWith("/video") 
  );

  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const [questions, setQuestions] = useRecoilState(onBoardingQuestionsAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div></div>;
  }

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
