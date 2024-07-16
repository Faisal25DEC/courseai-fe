"use client";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { fetchOnboardingQuestions } from "@/services/onboarding.service";
import { useRecoilState } from "recoil";
import { currentUserRoleAtom, onBoardingQuestionsAtom } from "@/store/atoms";
import { admin, member } from "@/lib/constants";

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const shouldShowSidebar = !pathname.startsWith("/video");

  const [currentUserRole, setCurrentUserRole] = useRecoilState(currentUserRoleAtom);
  const [questions, setQuestions] = useRecoilState(onBoardingQuestionsAtom);
  const [isOnBoarding, setIsOnBoarding] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isLoaded || !organization || hasFetched) return;

    const fetchAdminId = async () => {
      try {
        const membershipsResponse = await organization.getMemberships();
        const memberships = membershipsResponse.data;

        const admin = memberships.find((member) => member.role === "org:admin");
        if (admin) {
          await fetchQuestions(admin.publicUserData.userId as string);
        } else if (currentUserRole === member) {
          router.push("/courses/list");
        }
      } catch (error) {
        if (currentUserRole === member) {
          router.push("/courses/list");
        }
      } finally {
        setHasFetched(true);
      }
    };

    fetchAdminId();
  }, [isClient, isLoaded, organization, router, currentUserRole, hasFetched]);

  const fetchQuestions = async (id: string) => {
    try {
      const data = await fetchOnboardingQuestions(id);
      setQuestions(data.data.questions);
      setIsOnBoarding(true);
      if (currentUserRole === member && pathname !== "/onboarding-flow") {
        router.push("/onboarding-flow");
      }
    } catch (error) {
      setIsOnBoarding(false);
      if (currentUserRole === member && pathname !== "/courses/list") {
        router.push("/courses/list");
      }
    }
  };

  // useEffect(() => {
  //   if (isClient && currentUserRole === admin && pathname !== "/courses/list") {
  //     router.push("/courses/list");
  //   }
  // }, [isClient, currentUserRole, router, pathname]);

  if (!isClient) {
    return <div>Loading...</div>; // Render a consistent placeholder on the server
  }

  if (isOnBoarding && currentUserRole === member && pathname !== "/onboarding-flow") {
    router.push("/onboarding-flow");
    return <div>Redirecting...</div>; // Render a consistent placeholder while redirecting
  }

  if (!isOnBoarding && currentUserRole === member && pathname !== "/courses/list") {
    router.push("/courses/list");
    return <div>Redirecting...</div>; // Render a consistent placeholder while redirecting
  }

  return (
    <div className="flex">
      <SignedIn>
        {questions.length > 0 && shouldShowSidebar && (
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
