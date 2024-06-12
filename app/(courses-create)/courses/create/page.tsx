"use client";
import { Button } from "@/components/ui/button";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import React, { useEffect } from "react";
import CreateLessonModal from "./_components/create-lesson-modal/create-lesson-modal";
import { useRecoilState } from "recoil";
import {
  avatarsAtom,
  currentCourseAtom,
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
import LessonCard from "./_components/lesson-card/lesson-card";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { apiKey, currentCourseId, heygenBaseUrl } from "@/lib/constants";
import { toast } from "sonner";
import { StrictModeDroppable } from "@/components/shared/strict-mode-droppable/strict-mode-droppable";
import Link from "next/link";
import { getFilteredVoiceAndAvatarObjects } from "@/lib/ArrayHelpers/ArrayHelpers";
import { updateCourse } from "@/services/lesson.service";

const CreateCourse = () => {
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
  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/courses/6667760f255b05556e58b41a`
        );
        setCurrentCourse(res.data);
        setLessonsArray(res.data.lessons);
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
  } = useCreateLessonModal();
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
    console.log(result, "Dragged");
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
      console.log(newLessonsArray, "Dragged");
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
    const filteredAvatars = avatarsData.data.avatars.map((item: any) => {
      return { avatar_id: item.avatar_id, ...item.avatar_states[0] };
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
    const selectedAvatars = [...maleAvatars, ...femaleAvatars];

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
    const selectedVoices = [...maleVoices, ...femaleVoices];

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
            <h1 className=" font-normal text-gray-600 text-2xl">Lessons</h1>
          </div>
          <div className="flex justify-end gap-4 items-center">
            <div className="flex items-center gap-[24px]">
              <Button
                onClick={() => {
                  onCreateLessonModalOpen();
                  setLessonModalType(null);
                }}
              >
                Create Lesson
              </Button>
              <Link href="/courses/preview">
                <Button variant={"outline"}>Preview Course</Button>
              </Link>
            </div>
          </div>
        </div>
        <hr />
        <StrictModeDroppable droppableId="Visuals">
          {(provided) => (
            <div
              className=" w-[90%] mx-auto flex flex-col my-2 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lessonsArray.map((lesson: any, idx: number) => (
                <LessonCard key={idx} lesson={lesson} index={idx} />
              ))}

              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
        {isCreateLessonModalOpen && <CreateLessonModal />}
      </div>
    </DragDropContext>
  );
};

export default CreateCourse;
