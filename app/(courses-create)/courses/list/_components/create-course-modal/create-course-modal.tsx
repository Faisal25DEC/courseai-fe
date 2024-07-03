"use client";
import React, { useEffect } from "react";
import Modal from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  courseIdAtom,
  courseNameAtom,
  currentOrganizationIdAtom,
} from "@/store/atoms";

import { Icon } from "@iconify/react";
import { createCourse } from "@/services/lesson.service";
import useCreateCourseModal from "@/hooks/useCreateCourseModal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
const CreateCourseModal = () => {
  const router = useRouter();
  const currentOrgId = useRecoilValue(currentOrganizationIdAtom);
  const [courseName, setCourseName] = useRecoilState(courseNameAtom);
  const [courseId, setCourseId] = useRecoilState(courseIdAtom);
  const {
    isOpen: isCreateCourseModalOpen,
    onOpen: onCreateCourseModalOpen,
    onClose: onCreateCourseModalClose,
  } = useCreateCourseModal(false);

  const handleCourseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
  };

  const handleCreateCourse = async () => {
    try {
      const courseData = {
        title: courseName,
        org_id: currentOrgId,
        lessons: [],
      };
      let res = await createCourse(courseData);
      setCourseId(res.id);
      onCreateCourseModalClose();
      router.push(`/courses/create-lesson/${res.id}`);
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  return (
    <Modal
      className="h-[45vh] "
      showIcon
      isOpen={isCreateCourseModalOpen}
      onClose={onCreateCourseModalClose}
    >
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-[20px]">
        <div className=" text-xl bg-gray-100 ">
          <h1 className=" px-8 h-[80px] flex items-center">Create Course</h1>
          <hr className="bg-white" />
        </div>
        <div className="flex flex-col gap-8 px-8 pb-2 bg-white overflow-y-scroll mb-[90px]">
          <div className="label-container">
            <label className="label">Course Name</label>
            <Input
              onChange={handleCourseTitleChange}
              value={courseName}
              placeholder="Course title"
            />
          </div>
          <div className="w-full flex justify-end absolute bottom-5 right-5">
            <Button
              onClick={() => handleCreateCourse()}
              disabled={!createCourse}
              className="w-[30%]"
            >
              Create Course
            </Button>
          </div>
        </div>

        <div
          onClick={onCreateCourseModalClose}
          className="absolute cursor-pointer transition-all duration-300 ease-in top-[15px] hover:bg-slate-200 right-[15px] p-[3px] rounded-full "
        >
          <Icon icon="system-uicons:cross" style={{ color: "rgb(25,25,25)" }} />
        </div>
      </div>
    </Modal>
  );
};

export default CreateCourseModal;
