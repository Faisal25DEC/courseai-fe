"use client";
import React, { useEffect } from "react";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import Modal from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { buttons } from "./constants";
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
import CreateContent from "../create-content/create-content";
import { Textarea } from "@/components/ui/textarea";
import Submissions from "../submissions/submissions";
import axios from "axios";
import { baseUrl } from "@/lib/config";
import { getMaxId } from "@/lib/ArrayHelpers/ArrayHelpers";
const CreateLessonModal = () => {
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
  } = useCreateLessonModal();

  const handleChangeType = (value: string) => {
    setCurrentLesson({ ...currentLesson, type: value });
  };
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
      const res1 = await axios.post(
        `${baseUrl}/courses/6667760f255b05556e58b41a/lessons`,
        {
          id: getMaxId(lessonsArray),
          ...currentLesson,
          submission_status:
            currentLesson.submission?.toLowerCase() === "automatic"
              ? "approved"
              : "pending",
        }
      );
      const res = await axios.get(
        `${baseUrl}/courses/6667760f255b05556e58b41a`
      );
      setCurrentCourse(res.data);
      setLessonsArray(res.data.lessons);
      onCreateLessonModalClose();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setCurrentLesson({ ...currentLesson, content: null });
    return () => {
      setCurrentLesson({
        title: "",
        description: "",
        type: "",
        content: null,
        submission: "",
        submission_status: "",
      });
      setLessonCreateSteps(1);
    };
  }, [currentLesson.type]);
  useEffect(() => {
    if (lessonModalType?.type === "edit") {
      setCurrentLesson(lessonModalType.lesson);
    }
    return () => {
      setLessonModalType(null);
      setCurrentLesson({
        title: "",
        description: "",
        type: "",
        content: null,
        submission: "",
        submission_status: "",
      });
    };
  }, [lessonModalType]);
  console.log(currentLesson);
  return (
    <Modal
      className="min-h-[80vh]"
      showIcon
      isOpen={isCreateLessonModalOpen}
      onClose={onCreateLessonModalClose}
    >
      <div className="flex flex-col gap-6 overflow-hidden rounded-[20px] relative">
        <div className=" text-xl bg-gray-100 ">
          <h1 className=" px-8 h-[80px] flex items-center">Create Lesson</h1>
          <hr className="bg-white" />
        </div>
        {lessonCreateSteps === 1 && (
          <div className="flex flex-col gap-8 px-8 bg-white">
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
            <div className="label-container">
              <label className="label">Select Lesson Type</label>
              <div className="flex items-center gap-2 flex-wrap">
                {buttons.map((button, idx) => (
                  <div key={idx} onClick={() => handleChangeType(button.value)}>
                    <div
                      className={`w-[150px] cursor-pointer h-[120px] relative rounded-[12px] ${
                        currentLesson.type === button.value
                          ? "bg-blue-200"
                          : "bg-blue-50"
                      }`}
                    >
                      <div className="absolute bottom-3 left-[10%] text-sm">
                        {button.label}
                      </div>
                      <div
                        className={`absolute top-3 left-3 h-3 w-3 rounded-full border-blue-500 border ${
                          currentLesson.type === button.value
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {lessonCreateSteps === 1 && (
          <div className="bg-gray-100 absolute bottom-0 h-[80px] flex items-center justify-center left-0 w-full">
            <Button
              onClick={() => incrementStep(1)}
              disabled={!currentLesson.title || !currentLesson.type}
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
              onClick={() => incrementStep(1)}
              disabled={!currentLesson.title || !currentLesson.type}
              className="w-[50%]"
            >
              Next
            </Button>
          </div>
        )}
        {lessonCreateSteps === 3 && (
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
              disabled={!currentLesson.title || !currentLesson.type}
              className="w-[50%]"
            >
              Create Lesson
            </Button>
          </div>
        )}

        {lessonCreateSteps === 2 && <CreateContent />}
        {lessonCreateSteps === 3 && <Submissions />}
      </div>
    </Modal>
  );
};

export default CreateLessonModal;
