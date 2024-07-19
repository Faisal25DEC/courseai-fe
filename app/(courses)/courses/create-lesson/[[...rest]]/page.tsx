"use client";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import React, { useEffect, useState } from "react";
import CreateLessonModal from "../_components/create-lesson-modal/create-lesson-modal";
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
import LessonCard from "../_components/lesson-card/lesson-card";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { admin, apiKey, heygenBaseUrl } from "@/lib/constants";
import { toast } from "sonner";

import Link from "next/link";
import { getFilteredVoiceAndAvatarObjects } from "@/lib/ArrayHelpers/ArrayHelpers";
import { updateCourse } from "@/services/lesson.service";
import { avatars as avatarsArray } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import NotFoundImage from "../../../../../public/images/not-found.webp";
import Image from "next/image";
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import PreviewCard from "../_components/preview-card/preview-card";
import PreivewLesson from "../_components/preview/Preview";
import PreivewCourse from "../../preview/preview-course";

const CreateCourse = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentCourseId, setCurrentCourseId] = useState<string>("");

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
  const [isPageView, setIsPageView] = useState("preview");
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    const pathParts = pathname.split("/");
    const courseId = pathParts[pathParts.length - 1];
    setCurrentCourseId(courseId);
    console.log("lessons array", lessonsArray);
  }, [pathname, isPageView]);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      if (currentCourseId) {
        try {
          const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
          setCurrentCourse(res.data);
          // setLessonsArray(res.data.lessons);
          setCourseTitle(res.data.title);
        } catch (error) {
          console.log(error);
        } finally {

        }
      }
    };
    fetchCurrentCourse();
  }, [setCurrentCourse]);

  const fetchAvatarsAndVoices = async () => {
    if (avatars.length > 0 && voices.length > 0) return;
    try {
      const { data: voicesData } = await axios.get(
        `${heygenBaseUrl}/v1/voice.list`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
        }
      );
      const { data: avatarsData } = await axios.get(
        `${heygenBaseUrl}/v1/avatar.list`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
        }
      );
      const filteredAvatars = avatarsData.data.avatars
        .map((item: any) => {
          return { avatar_id: item.avatar_id, ...item.avatar_states[0] };
        })
        .filter((avatar: any) => {
          return avatarsArray.some(
            (avatarItem: any) => avatarItem.id === avatar.avatar_id
          );
        });
      const filteredVoices = voicesData.data.list.filter(
        (item: any) => item.language === "English"
      );

      const maleAvatars = getFilteredVoiceAndAvatarObjects(
        filteredAvatars,
        "male",
        5
      );
      const femaleAvatars = getFilteredVoiceAndAvatarObjects(
        filteredAvatars,
        "female",
        5
      );
      const selectedAvatars = [...maleAvatars];

      const maleVoices = getFilteredVoiceAndAvatarObjects(
        filteredVoices,
        "male",
        5
      );
      const femaleVoices = getFilteredVoiceAndAvatarObjects(
        filteredVoices,
        "female",
        5
      );
      const selectedVoices = [...maleVoices];

      setAvatars(selectedAvatars || []);
      setVoices(selectedVoices || []);
    } catch (error) {
      console.error("Failed to fetch avatars and voices:", error);
    }
  };

  useEffect(() => {
    fetchAvatarsAndVoices();
  }, []);

  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal(false);

  useEffect(() => {
    if (!isCreateLessonModalOpen) {
      setCurrentLesson({
        title: "",
        description: "",
        type: "",
        content: null,
        submission: "",
        submission_status: "",
      });
      setLessonModalType(null);
      setLessonCreateSteps(1);
    }
  }, [
    isCreateLessonModalOpen,
    setCurrentLesson,
    setLessonModalType,
    setLessonCreateSteps,
  ]);

  const popoverContent = [
    {
      title: "Edit",
      onClick: async () => {},
      icon: EditIcon2,
    },
    {
      title: "Delete",
      onClick: () => {},
      icon: TrashIcon2,
    },
  ];

  const updateCourseLessons = (data: any) => {
    return null;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (
      source.droppableId === "Visuals" &&
      destination.droppableId === "Visuals"
    ) {
      const copiedLessonsArray = Array.from(lessonsArray);
      const newLessonsArray = Array.from(lessonsArray);
      const [removed] = newLessonsArray.splice(source.index, 1);
      newLessonsArray.splice(destination.index, 0, removed);

      toast.loading("Saving changes...", { duration: 2000 });
      setLessonsArray(newLessonsArray);
      updateCourse(currentCourseId, {
        lessons: newLessonsArray,
      })
        .then(() => {
          toast.success("Changes saved successfully!");
          toast.dismiss();
        })
        .catch(() => {
          setLessonsArray(copiedLessonsArray);
          toast.error("Failed to save changes!");
          toast.dismiss();
        });
    }
  };

  const lastItem = popoverContent[popoverContent.length - 1];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-[100%] flex flex-col gap-2">
        <div className="relative flex w-[100%] justify-between items-center pt-3 pb-1 pr-5 h-[55px]">
          <Breadcrumbs className="pl-8">
            <BreadcrumbItem
              onPress={() => {
                router.push("/courses/list");
              }}
            >
              Courses
            </BreadcrumbItem>
            <BreadcrumbItem className="font-bold">{courseTitle}</BreadcrumbItem>
          </Breadcrumbs>
          <div className="mt-2 gap-2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              className={`${
                isPageView === "edit"
                  ? "border-b-2 font-[600] text-black"
                  : "text-gray-500"
              } h-[60px] border-pink-300 text-[15px]  pb-2`}
              onClick={() => {
                setIsPageView("edit");
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setIsPageView("preview");
              }}
              className={`${
                isPageView === "preview"
                  ? "font-[600] border-b-2 text-black"
                  : "text-gray-500"
              } border-pink-300 h-[60px] pb-2 ml-4 text-[15px] `}
            >
              Preview
            </button>
          </div>
          <div className="flex justify-end items-center">
            {/* {currentUserRole === admin && (
              <div className="flex items-center gap-[24px]">
                <Button
                  color="primary"
                  onClick={() => onCreateLessonModalOpen()}
                >
                  Create Lesson
                </Button>
              
              </div>
            )} */}
          </div>
        </div>
        {/* <hr /> */}
        {isPageView === "edit" && (
         <PreivewLesson/>
        )}
        {isPageView === "preview" && (
          <div className="h-[92vh] w-full flex items-center justify-center">
            <PreivewCourse />
          </div>
        )}
        {isCreateLessonModalOpen && <CreateLessonModal />}
      </div>
    </DragDropContext>
  );
};

export default CreateCourse;
