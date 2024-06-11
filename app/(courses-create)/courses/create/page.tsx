"use client";
import { Button } from "@/components/ui/button";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import React, { useEffect } from "react";
import CreateLessonModal from "./_components/create-lesson-modal/create-lesson-modal";
import { useRecoilState } from "recoil";
import { currentCourseAtom, lessonsArrayAtom } from "@/store/atoms";
import { baseUrl } from "@/lib/config";
import axios from "axios";
import { Icon } from "@iconify/react";
import { EditIcon2 } from "@/assets/icons/EditIcon";
import { TrashIcon2 } from "@/assets/icons/TrashIcon";
import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import useDisclosure from "@/hooks/useDisclosure";
import LessonCard from "./_components/lesson-card/lesson-card";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { currentCourseId } from "@/lib/constants";
import { toast } from "sonner";
import { StrictModeDroppable } from "@/components/shared/strict-mode-droppable/strict-mode-droppable";
import Link from "next/link";

const CreateCourse = () => {
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
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
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      // updateCourseLessons({
      //   id: currentCourseId,
      //   lessonsArray: newLessonsArray,
      // })
      //   .then(() => {
      //     toast.success("Changes saved successfully!");
      //     toast.dismiss();
      //   })
      //   .catch(() => {
      //     setLessonsArray(copiedLessonsArray);
      //     toast.error("Failed to save changes!");
      //     toast.dismiss();
      //   });
    }
  };

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
              <Button onClick={onCreateLessonModalOpen}>Create Lesson</Button>
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
              className=" w-[90%] mx-auto flex flex-col mt-2 gap-4"
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
        <CreateLessonModal />
      </div>
    </DragDropContext>
  );
};

export default CreateCourse;
