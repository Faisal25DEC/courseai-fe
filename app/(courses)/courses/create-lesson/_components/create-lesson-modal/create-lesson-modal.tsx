"use client";
import React, { useEffect, useState } from "react";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import Modal from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { buttons } from "./constants";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  courseIdAtom,
  courseNameAtom,
  currentCourseAtom,
  lessonAtom,
  lessonCreateStepsAtom,
  lessonModalTypeAtom,
  lessonsArrayAtom,
  scorecardQueAtom,
} from "@/store/atoms";
import {
  decrementLessonCreateStepSelector,
  incrementLessonCreateStepSelector,
} from "@/store/selectors";
import { Icon } from "@iconify/react";
import CreateContent from "../create-content/create-content";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { baseUrl } from "@/lib/config";
import { getMaxId } from "@/lib/ArrayHelpers/ArrayHelpers";

const CreateLessonModal = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [courseName, setCourseName] = useRecoilState(courseNameAtom);
  const [lessonCreateSteps, setLessonCreateSteps] = useRecoilState(
    lessonCreateStepsAtom
  );
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useRecoilState<any>(scorecardQueAtom);

  const incrementStep = useSetRecoilState(incrementLessonCreateStepSelector);
  const decrementStep = useSetRecoilState(decrementLessonCreateStepSelector);
  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal(false);

  const handleChangeType = (value: string) => {
    setCurrentLesson({ ...currentLesson, type: value });
  };

  const handleLessonTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLesson({ ...currentLesson, title: e.target.value });
  };

  const handleCourseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
  };

  const handleLessonDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentLesson({ ...currentLesson, description: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const lessonData = {
        ...currentLesson,
        is_practice_lesson: false,
        scorecard_questions: questions,
        submission_status: currentLesson.submission_status || "pending",
        submission: "automatic",
      };

      if (lessonModalType?.type === "edit") {
        const { id, ...currentLessonWithoutId } = lessonData;
        const res1 = await axios.patch(
          `${baseUrl}/courses/${currentCourseId}/lessons/${currentLesson.id}`,
          currentLessonWithoutId
        );
        const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
        setCurrentCourse(res.data);
        setLessonsArray(res.data.lessons);
        onCreateLessonModalClose();
        return;
      }

      const { id, ...currentLessonWithoutId } = lessonData;
      const res1 = await axios.post(
        `${baseUrl}/courses/${currentCourseId}/lessons`,
        {
          id: getMaxId(lessonsArray) + 1,
          ...currentLessonWithoutId,
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
      is_practice_lesson: false,
    });

    if (lessonModalType?.type === "edit") {
      setQuestions(currentLesson.scorecard_questions);
    }

    return () => {
      setQuestions([]);
    };
  }, [currentLesson.type]);

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_: any, i: number) => i !== index));
  };

  return (
    <Modal
      className="h-[85vh]"
      showIcon
      isOpen={isCreateLessonModalOpen}
      onClose={onCreateLessonModalClose}
    >
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-[20px]">
        <div className="text-xl bg-gray-100">
          <h1 className="px-8 h-[80px] flex items-center">Create Lesson</h1>
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
                        className={`absolute top-3 left-3 h-3 w-3 flex items-center justify-center rounded-full border-blue-500 border ${
                          currentLesson.type === button.value
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        {currentLesson.type === button.value && (
                          <div className="bg-blue-500 w-[6px] h-[6px] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {currentLesson.type === "avatar" && (
              <div className="label-container">
                <label className="label">Add Scorecard Questions</label>
                <div className="flex gap-2">
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter question"
                  />
                  <Button onClick={handleAddQuestion}>Add</Button>
                </div>
                <ul className="text-sm mb-2">
                  {questions.map((question: any, index: any) => (
                    <li
                      className="flex my-2 font-semibold capitalize"
                      key={index}
                    >
                      {index + 1}. {question}
                      <Icon
                        icon="fluent:delete-16-regular"
                        className="text-red-400 w-5 h-5 font-bold ml-5 cursor-pointer"
                        onClick={() => handleDeleteQuestion(index)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={
                !currentLesson.title ||
                !currentLesson.type ||
                !currentLesson.description
              }
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

export default CreateLessonModal;
