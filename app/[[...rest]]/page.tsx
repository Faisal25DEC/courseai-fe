"use client";
import CreateLessonLoader from "@/components/Loaders/create-lesson-loader/create-lesson-loader";
import LessonLoader from "@/components/Loaders/lesson-loader/lesson-loader";
import Modal from "@/components/shared/modal";
import useNoOrganizationModal from "@/hooks/useNoOrganizationModal";
import useSetOrganization from "@/hooks/useSetOrganization";
import { admin, member } from "@/lib/constants";
import { courseIdAtom, currentUserRoleAtom } from "@/store/atoms";
import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function Home() {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const {
    isNoOrganizationModalOpen,
    onNoOrganizationModalClose,
    onNoOrganizationModalOpen,
  } = useNoOrganizationModal();

  useSetOrganization();
  useEffect(() => {
    if (currentUserRole) {
      if (currentUserRole === admin) {
        redirect("/courses/list");
      }
      if (currentUserRole === member) {
        redirect(`courses/list`);
      }
    }
  }, [currentUserRole]);
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center mx-auto w-[90%]">
      {/* <h1 className="text-[36px] text-gray-700">Under Construction</h1> */}
      {/* <img
        src="https://t4.ftcdn.net/jpg/00/89/02/67/360_F_89026793_eyw5a7WCQE0y1RHsizu41uhj7YStgvAA.jpg"
        className="w-[400px] h-[400px] object-cover"
      /> */}
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
