"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  courseIdAtom,
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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { baseUrl } from "@/lib/config";
import { getMaxId } from "@/lib/ArrayHelpers/ArrayHelpers";
import CreateContent from "@/app/(courses-create)/courses/create-lesson/_components/create-content/create-content";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";

const CreatePracticeLessonModal = () => {
  const currentCourseId = process.env.NEXT_PUBLIC_CURRENT_COURSE_ID;
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [lessonCreateSteps, setLessonCreateSteps] = useRecoilState(
    lessonCreateStepsAtom
  );
  const [questions, setQuestions] = useRecoilState<any>(scorecardQueAtom);
  const [newQuestion, setNewQuestion] = useState("");

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

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const handleSubmit = async () => {
    try {
      const lessonData = {
        ...currentLesson,
        scorecard_questions: questions,
        submission_status: currentLesson.submission_status || "pending",
      };

      console.log("Payload being sent for update:", lessonData);

      if (lessonModalType?.type === "edit") {
        const { id, ...currentLessonWithoutId } = currentLesson;
        await axios.patch(
          `${baseUrl}/courses/${currentCourseId}/lessons/${currentLesson.id}`,
          lessonData
        );
      } else {
        await axios.post(`${baseUrl}/courses/${currentCourseId}/lessons`, {
          id: getMaxId(lessonsArray) + 1,
          ...lessonData,
        });
      }

      const res = await axios.get(`${baseUrl}/courses/${currentCourseId}`);
      setCurrentCourse(res.data);
      setLessonsArray(res.data.lessons);
      onCreateLessonModalClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentLesson({
      ...currentLesson,
      content: null,
      type: "avatar",
      submission: "automatic",
      is_practice_lesson: true,
    });

    if (lessonModalType?.type === "edit") {
      setQuestions(currentLesson.scorecard_questions);
    }

    return () => {
      setQuestions([]);
    };
  }, [currentLesson.type]);

  console.log("current less ", currentLesson);

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_: any, i: number) => i !== index));
  };

  return (
    <Modal
      className="h-[85vh] "
      showIcon
      isOpen={isCreateLessonModalOpen}
      onClose={onCreateLessonModalClose}
    >
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-[20px]">
        <div className="text-xl bg-gray-100">
          <h1 className="px-8 h-[80px] flex items-center">
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
              <ul className="text-sm my-2">
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
