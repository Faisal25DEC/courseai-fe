"use client";
import { Button } from "@/components/ui/button";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  avatarsAtom,
  currentCourseAtom,
  currentUserRoleAtom,
  lessonAtom,
  lessonCreateStepsAtom,
  lessonModalTypeAtom,
  lessonsArrayAtom,
  voicesAtom,
} from "@/store/atoms";
import { baseUrl } from "@/lib/config";
import axios from "axios";
import { Icon } from "@iconify/react";
import { EditIcon2 } from "@/assets/icons/EditIcon";
import { TrashIcon2 } from "@/assets/icons/TrashIcon";
import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import useDisclosure from "@/hooks/useDisclosure";

import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { admin, apiKey, heygenBaseUrl } from "@/lib/constants";
import { toast } from "sonner";
import { StrictModeDroppable } from "@/components/shared/strict-mode-droppable/strict-mode-droppable";
import Link from "next/link";
import { getFilteredVoiceAndAvatarObjects } from "@/lib/ArrayHelpers/ArrayHelpers";
import { getAllCourses, updateCourse } from "@/services/lesson.service";
import { avatars as avatarsArray } from "@/lib/constants";
import CreateLessonModal from "../../create-lesson/_components/create-lesson-modal/create-lesson-modal";
import CourseCard from "../_components/course-card/course-card";
import CreateCourseModal from "../_components/create-course-modal/create-course-modal";
import useCreateCourseModal from "@/hooks/useCreateCourseModal";
import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@nextui-org/react";
import CourseListCard from "../_components/course-card/course-card-list";

const CreateCourse = () => {
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const [avatars, setAvatars] = useRecoilState<any>(avatarsAtom);
  const [voices, setVoices] = useRecoilState<any>(voicesAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [currentLesson, setCurrentLesson] = useRecoilState<any>(lessonAtom);
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [lessonCreateSteps, setLessonCreateSteps] = useRecoilState(
    lessonCreateStepsAtom
  );
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState("grid");

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res);
        console.log("all courses", res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentCourse();
  }, []);

  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateCourseModal(false);

  const handleTabChange = (key: any) => {
    setSelectedTab(key);
  };

  return (
    <div className="w-[100%] mx-auto flex flex-col gap-2">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <Breadcrumbs>
          <BreadcrumbItem>Courses</BreadcrumbItem>
          <BreadcrumbItem>Create Courses</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end gap-4 items-center">
          {currentUserRole === admin && (
            <div className="flex items-center gap-[24px]">
              <Button
                onClick={() => {
                  onCreateLessonModalOpen();
                  setLessonModalType(null);
                }}
              >
                Create Course
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mx-14">
        <Tabs
          aria-label="Options"
          selectedKey={selectedTab}
          onSelectionChange={handleTabChange}
        >
          <Tab
            key="grid"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="mingcute:grid-fill" />
                <span>Grid</span>
              </div>
            }
          />
          <Tab
            key="list"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="fa-solid:list" />
                <span>List</span>
              </div>
            }
          />
        </Tabs>
      </div>
      <div className="w-[90%] mx-auto my-2">
        {selectedTab === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((cr, ind) => (
              <CourseCard key={ind} course={cr} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {courses.map((cr, ind) => (
              <CourseListCard key={ind} course={cr} />
            ))}
          </div>
        )}
      </div>
      {isCreateLessonModalOpen && <CreateCourseModal />}
    </div>
  );
};

export default CreateCourse;
