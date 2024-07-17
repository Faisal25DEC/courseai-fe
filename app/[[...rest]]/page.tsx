"use client";
import CreateLessonLoader from "@/components/Loaders/create-lesson-loader/create-lesson-loader";
import LessonLoader from "@/components/Loaders/lesson-loader/lesson-loader";
import Modal from "@/components/shared/modal";
import useNoOrganizationModal from "@/hooks/useNoOrganizationModal";
import useSetOrganization from "@/hooks/useSetOrganization";
import { admin, member } from "@/lib/constants";
import { currentUserRoleAtom } from "@/store/atoms";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getUserById } from "@/services/user.service";
import { useUser } from "@clerk/nextjs";
import withAuth from "@/components/hoc/withAuth";

function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [currentUserRole, setCurrentUserRole] = useRecoilState(currentUserRoleAtom);
  const { isNoOrganizationModalOpen } = useNoOrganizationModal();
  const [isLoading, setIsLoading] = useState(true);

  useSetOrganization();

  // useEffect(() => {
  //   const checkUserVerification = async () => {
  //     try {
  //       const userData = await getUserById(user?.id as any);
  //       if (userData.data.verified) {
  //         if (currentUserRole === admin && pathname !== "/courses/list") {
  //           router.push("/courses/list");
  //         }
  //       } else {
  //         if (currentUserRole === admin && pathname !== "/courses/list") {
  //           router.push("/courses/list");
  //         } else if (pathname !== "/onboarding-flow") {
  //           router.push("/onboarding-flow");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error checking user verification:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (user?.id) {
  //     checkUserVerification();
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [user, router, currentUserRole, pathname]);

  // if (isLoading) {
  //   return (
  //     <main className="flex min-h-screen flex-col gap-6 items-center mx-auto w-[90%]">
  //       <h1 className="text-[36px] text-gray-700">Loading...</h1>
  //     </main>
  //   );
  // }

  return (
    <main className="flex min-h-screen flex-col gap-6 items-center mx-auto w-[90%]">
      {currentUserRole === admin && <CreateLessonLoader />}
      {currentUserRole === member && <LessonLoader />}
      <Modal
        className="w-[500px]"
        isOpen={isNoOrganizationModalOpen}
        onClose={() => null}
      >
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-[24px] font-medium text-center text-gray-600">
            Non-Organizational Members Are Not Allowed
          </h1>
          <h1 className="text-[18px] font-medium text-center text-gray-600">
            You Will Be Signed Out
          </h1>
        </div>
      </Modal>
    </main>
  );
}

export default withAuth(Home)