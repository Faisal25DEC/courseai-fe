"use client";
import React, { useEffect } from "react";
import Modal from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentCourseAtom,
  lessonAtom,
  lessonCreateStepsAtom,
  lessonModalTypeAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import {
  decrementLessonCreateStepSelector,
  incrementLessonCreateStepSelector,
} from "@/store/selectors";
import { Icon } from "@iconify/react";

import { Textarea } from "@/components/ui/textarea";

import axios from "axios";
import { baseUrl } from "@/lib/config";
import { getMaxId } from "@/lib/ArrayHelpers/ArrayHelpers";
import { currentCourseId } from "@/lib/constants";
import CreateContent from "@/app/(courses-create)/courses/create/_components/create-content/create-content";
import Submissions from "@/app/(courses-create)/courses/create/_components/submissions/submissions";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
const CreatePracticeLessonModal = () => {
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);

  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [lessonCreateSteps, setLessonCreateSteps] = useRecoilState(
    lessonCreateStepsAtom
  );
  const incrementStep = useSetRecoilState(incrementLessonCreateStepSelector);
  const decrementStep = useSetRecoilState(decrementLessonCreateStepSelector);
  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal(true);

  const handleLessonTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLesson({ ...currentLesson, title: e.target.value });
  };
  const handleLessonDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentLesson({ ...currentLesson, description: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (lessonModalType?.type === "edit") {
        const { id, ...currentLessonWithoutId } = currentLesson;
        const res1 = await axios.patch(
          `${baseUrl}/courses/${currentCourseId}/lessons/${currentLesson.id}`,
          {
            ...currentLessonWithoutId,
            submission_status: currentLesson.submission_status || "pending",
          }
        );
        const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
        setCurrentCourse(res.data);
        setLessonsArray(res.data.lessons);
        onCreateLessonModalClose();
        return;
      }
      const res1 = await axios.post(
        `${baseUrl}/courses/${currentCourseId}/lessons`,
        {
          id: getMaxId(lessonsArray) + 1,
          ...currentLesson,
          submission_status: "pending",
        }
      );
      const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
      setCurrentCourse(res.data);
      setLessonsArray(res.data.lessons);
      onCreateLessonModalClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentLesson.type);
    setCurrentLesson({
      ...currentLesson,
      content: null,
      type: "avatar",
      submission: "automatic",
      is_practice_lesson: true,
    });

    // return () => {
    //   setCurrentLesson({
    //     title: "",
    //     description: "",
    //     type: "",
    //     content: null,
    //     submission: "",
    //     submission_status: "",
    //   });
    //   setLessonCreateSteps(1);
    // };
  }, [currentLesson.type]);

  console.log("current lesson ", currentLesson);

  return (
    <Modal
      className="h-[85vh] "
      showIcon
      isOpen={isCreateLessonModalOpen}
      onClose={onCreateLessonModalClose}
    >
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-[20px]">
        <div className=" text-xl bg-gray-100 ">
          <h1 className=" px-8 h-[80px] flex items-center">
            Create Practice Lesson
          </h1>
          <hr className="bg-white" />
        </div>
        {lessonCreateSteps === 1 && (
          <div className="flex flex-col gap-8 px-8 pb-2 bg-white overflow-y-scroll mb-[90px]">
            <div className="label-container">
              <label className="label">Title</label>
              <Input
                onChange={handleLessonTitleChange}
                value={currentLesson.title}
                placeholder="Lesson title"
              />
            </div>
            <div className="label-container">
              <label className="label">Description</label>
              <Textarea
                rows={6}
                onChange={handleLessonDescriptionChange}
                value={currentLesson.description}
                placeholder="Lesson Description"
              />
            </div>
          </div>
        )}
        {lessonCreateSteps === 1 && (
          <div className="bg-gray-100 absolute bottom-0 h-[80px] flex items-center justify-center left-0 w-full">
            <Button
              onClick={() => {
                if (lessonModalType?.type === "edit") {
                  setCurrentLesson({
                    ...currentLesson,
                    content: lessonModalType.lesson?.content,
                  });
                }
                incrementStep(1);
              }}
              disabled={!currentLesson.title || !currentLesson.description}
              className="w-[60%]"
            >
              Next
            </Button>
          </div>
        )}
        {lessonCreateSteps === 2 && (
          <div className="bg-gray-100 px-4 absolute bottom-0 h-[80px] flex items-center gap-2 justify-center left-0 w-full">
            <Button
              variant={"outline"}
              onClick={() => decrementStep(1)}
              disabled={!currentLesson.title || !currentLesson.type}
              className="w-[50%]"
            >
              Back
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={
                !currentLesson.title ||
                !currentLesson.description ||
                !currentLesson.type
              }
              className="w-[50%]"
            >
              {lessonModalType?.type === "edit" ? "Update" : "Create"} Lesson
            </Button>
          </div>
        )}
        {lessonCreateSteps === 2 && <CreateContent />}

        <div
          onClick={onCreateLessonModalClose}
          className="absolute cursor-pointer transition-all duration-300 ease-in top-[15px] hover:bg-slate-200 right-[15px] p-[3px] rounded-full "
        >
          <Icon icon="system-uicons:cross" style={{ color: "rgb(25,25,25)" }} />
        </div>
      </div>
    </Modal>
  );
};

export default CreatePracticeLessonModal;
