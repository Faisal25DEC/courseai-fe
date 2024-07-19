"use client";
import { admin, colors, lessonTypeText, textFromBg } from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse } from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  currentUserRoleAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { StrictModeDroppable } from "@/components/shared/strict-mode-droppable/strict-mode-droppable";

import Tag from "@/components/shared/tag/tag";

import { StringFormats } from "@/lib/StringFormats";
import { Icon } from "@iconify/react";
import VideoLesson from "../../../[id]/_components/video-lesson/video-lesson";
import TextLesson from "../../../preview/_components/text-lesson/text-lesson";
import AvatarLesson from "../../../preview/_components/avatar-lesson/avatar-lesson";
import { typeColorObj } from "../../../[id]/constants";
import PreviewCard from "../preview-card/preview-card";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import { Button } from "@nextui-org/react";
const PreivewLesson = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPracticeList, setIsPracticeList] = useState<any>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      const practiceLessons = res.lessons.filter(
        (lesson: any) => lesson.is_practice_lesson !== true
      );
      setLessonsArray(practiceLessons);
      setIsLoading(false);
    });
    return () => {
      setLessonsArray([]);
    };
  }, [currentCourseId]);

  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };

  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal(false);

  return (
    <div className="overflow-hidden w-[100%] h-[92vh] flex flex-row justify-center border-t">
      <div className="relative w-[30%] border-r">
        <div className="flex justify-between items-center border-b-1 border-gray-500  w-full py-5 px-4">
          <div className="flex ">
            <Icon icon="gridicons:menus" className="text-gray-800 w-6 h-6" />
            <h1 className="text-[15px] text-gray-800 font-semibold pl-2">
              Contents
            </h1>
          </div>
          {/* <Icon
          // onClick={() => setshowContent(false)}
          icon="carbon:close-outline"
          className="cursor-pointer w-7 h-7 text-white"
        /> */}
        </div>
        <StrictModeDroppable droppableId="Visuals">
          {(provided) => (
            <>
              <div
                className="w-[100%] pb-40 h-full my-element overflow-auto flex flex-col"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {isLoading ? (
                  <div className="flex flex-col h-[60vh] justify-center items-center"></div>
                ) : lessonsArray.length !== 0 ? (
                  lessonsArray
                    .filter((lesson: any) => lesson.is_practice_lesson !== true)
                    .map(
                      (lesson: any, idx: number) =>
                        lesson && (
                          <PreviewCard
                            key={idx}
                            lesson={lesson}
                            index={idx}
                            isPractice={false}
                          />
                        )
                    )
                ) : (
                  <div className="flex flex-col h-[60vh] justify-center items-center">
                    <p className="text-sm mt-10 text-center text-gray-800 px-10">
                      It looks like there are no lessons available. Please{" "}
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => onCreateLessonModalOpen()}
                      >
                        create a new lesson{" "}
                      </span>
                      to get started.
                    </p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            </>
          )}
        </StrictModeDroppable>
        {currentUserRole === admin && (
          <div className="absolute left-0 right-0 bottom-0 h-[80px] flex p-4 bg-white shadow-[0px_-1px_0px_rgba(17,_24,_39,_0.08)]">
            <Button
              color="primary"
              className="bg-gray-800 cursor-pointer w-full font-semibold border-1 mt-2"
              size={"sm"}
              onClick={() => onCreateLessonModalOpen()}
            >
              <Icon icon="fluent:add-28-filled" className="font-semibold" />
              Add Lesson
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center w-[70%] px-2">
        <div className="w-full h-[90vh] my-4 flex justify-center items-center overflow-y-scroll my-element">
          <div className="flex w-[100%] h-[90vh] relative">
            <div className="w-full border rounded-lg border-gray-200 bg-white">
              {lessonsArray[activeLesson]?.type === "video" && (
                <VideoLesson
                  video={lessonsArray[activeLesson].content}
                  lesson={lessonsArray[activeLesson]}
                />
              )}
              {lessonsArray[activeLesson]?.type === "text" && (
                <TextLesson
                  lesson_id={lessonsArray[activeLesson].id}
                  lesson={lessonsArray[activeLesson]}
                />
              )}
              {lessonsArray[activeLesson]?.type === "avatar" && (
                <AvatarLesson
                  lesson_id={lessonsArray[activeLesson].id}
                  voice_id={lessonsArray[activeLesson].content?.voice_id}
                  avatar_id={lessonsArray[activeLesson].content?.avatar_id}
                  thumbnail={
                    lessonsArray[activeLesson].content?.avatar
                      ?.normal_thumbnail_medium
                  }
                  avatar_name={lessonsArray[activeLesson].content?.avatar?.id}
                  lesson={lessonsArray[activeLesson]}
                  setIsPracticeList={setIsPracticeList}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreivewLesson;
