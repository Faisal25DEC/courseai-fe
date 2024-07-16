"use client";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { fetchOnboardingQuestions } from "@/services/onboarding.service";
import { useRecoilState } from "recoil";
import { currentUserRoleAtom, onBoardingQuestionsAtom } from "@/store/atoms";
import { admin, member } from "@/lib/constants";
import { getUserById } from "@/services/user.service";

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();

  const shouldShowSidebar = !(
    pathname.startsWith("/onboarding-flow") ||
    pathname.startsWith("/video") 
  );
  
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const [questions, setQuestions] = useRecoilState(onBoardingQuestionsAtom);
  const [isOnBoarding, setIsOnBoarding] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkUserVerification = async () => {
      try {
        const userData = await getUserById(user?.id as any);
        console.log("user data ", userData);
        if (userData.data.verified) {
          router.push("/courses/list");
          setIsOnBoarding(true);
        } else {
          if (currentUserRole !== admin) {
            setIsOnBoarding(false);
            router.push("/onboarding-flow");
          } else {
            setIsOnBoarding(true);
            router.push("/courses/list");
          }
        }
      } catch (error) {
        console.error("Error checking user verification:", error);
        setIsOnBoarding(true);
      }
    };

    if (currentUserRole === member && user?.id) {
      checkUserVerification();
    }
  }, [user, router]);

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
