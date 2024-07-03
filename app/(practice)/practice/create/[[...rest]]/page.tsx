"use client";
import { Button } from "@/components/ui/button";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import React, { useEffect, useState } from "react";
// import CreateLessonModal from "../_components/create-lesson-modal/create-lesson-modal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeLessonAtom,
  avatarsAtom,
  courseIdAtom,
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
// import LessonCard from "../_components/lesson-card/lesson-card";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { admin, apiKey, heygenBaseUrl } from "@/lib/constants";
import { toast } from "sonner";
import { StrictModeDroppable } from "@/components/shared/strict-mode-droppable/strict-mode-droppable";
import Link from "next/link";
import { getFilteredVoiceAndAvatarObjects } from "@/lib/ArrayHelpers/ArrayHelpers";
import { updateCourse } from "@/services/lesson.service";
import { avatars as avatarsArray } from "@/lib/constants";
import CreatePracticeLessonModal from "../_components/create-practice-modal/create-practice-modal";
import LessonCard from "@/app/(courses-create)/courses/create-lesson/_components/lesson-card/lesson-card";
import NotFoundImage from "../../../../../public/images/not-found.webp";
import Image from "next/image";
import PracticeCard from "../_components/practice-card/practice-card";
import PreivewPractice from "../_components/preview/preview";

const CreateCourse = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

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
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
        setCurrentCourse(res.data);
        setLessonsArray(res.data.lessons);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentCourse();
  }, []);
  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal(true);
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
    const { destination, source, draggableId } = result;
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
  const fetchAvatarsAndVoices = async () => {
    if (avatars.length > 0 && voices.length > 0) return;
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
  };

  useEffect(() => {
    fetchAvatarsAndVoices();
  }, []);
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
  }, [isCreateLessonModalOpen]);
  const lastItem = popoverContent[popoverContent.length - 1];
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-[100%] mx-auto flex flex-col gap-2">
        {" "}
        <div className="flex w-[90%] m-auto justify-between items-center py-8">
          <div>
            <h1 className=" font-normal text-gray-600 text-2xl">Practice</h1>
          </div>
          <div className="flex justify-end gap-4 items-center">
            {currentUserRole === admin && (
              <div className="flex items-center gap-[24px]">
                <Button
                  onClick={() => {
                    onCreateLessonModalOpen();
                    setLessonModalType(null);
                  }}
                >
                  Create Practice Lesson
                </Button>
                {/* <Link href="/practice/preview">
                  <Button variant={"outline"}>Preview Course</Button>
                </Link> */}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row w-[100%]">
          <div className="ml-10 w-[35%] border-r h-[85vh] pr-4">
            <StrictModeDroppable droppableId="Visuals">
              {(provided) => (
                <div
                  className=" w-[90%] mx-auto flex flex-col my-2 gap-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {isLoading ? (
                    <div className="flex flex-col h-[60vh] justify-center items-center"></div>
                  ) : lessonsArray.length !== 0 ? (
                    lessonsArray.map((lesson: any, idx: number) =>
                      lesson.is_practice_lesson === true ? (
                        <PracticeCard
                          key={idx}
                          lesson={lesson}
                          index={idx}
                          isPractice={false}
                        />
                      ) : null
                    )
                  ) : (
                    <div className="flex flex-col h-[60vh] justify-center items-center">
                      <Image
                        src={NotFoundImage}
                        alt="No Lessons Found"
                        width={250}
                        height={250}
                      />
                      <p className="text-sm mt-10 text-center">
                        It looks like there are no lessons available. Please{" "}
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => onCreateLessonModalOpen()}
                        >
                          create a new lesson
                        </span>
                        to get started.
                      </p>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </div>
          <div className="w-[75%]">
            <PreivewPractice />
          </div>
        </div>
        {isCreateLessonModalOpen && <CreatePracticeLessonModal />}
      </div>
    </DragDropContext>
  );
};

export default CreateCourse;
