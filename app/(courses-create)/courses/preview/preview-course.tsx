"use client";
import { colors, lessonTypeText, textFromBg } from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse } from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import Tag from "@/components/shared/tag/tag";
import { StringFormats } from "@/lib/StringFormats";
import VideoLesson from "./_components/video-lesson/video-lesson";
import TextLesson from "./_components/text-lesson/text-lesson";
import AvatarLesson from "./_components/avatar-lesson/avatar-lesson";
import { typeColorObj } from "../[id]/constants";
import { Chip, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
const PreivewCourse = () => {
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [isPracticeList, setIsPracticeList] = useState<any>(true);
  const [showContent, setshowContent] = useState(true);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      const practiceLessons = res.lessons.filter(
        (lesson: any) => lesson.is_practice_lesson !== true
      );
      setLessonsArray(practiceLessons);
    });
  }, [currentCourseId,lessonsArray]);

  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  return (
    <div className="w-full h-[92vh] overflow-hidden border-1">
      <div className="flex h-full w-[100%]">
        {showContent && (
          <div className="w-[30%] border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col text-white my-element">
            <div className="flex justify-between items-center border-b-1 border-gray-600  w-full py-5 px-4">
              <div className="flex ">
                <Icon icon="gridicons:menus" className="text-gray-800 w-6 h-6" />
                <h1 className="text-[15px] text-gray-800 font-semibold pl-2">
                  Contents
                </h1>
              </div>
              <Icon
                onClick={() => setshowContent(false)}
                icon="carbon:close-outline"
                className="cursor-pointer w-7 h-7 text-gray-800"
              />
            </div>
            {lessonsArray
              .filter((lesson: any) => lesson.is_practice_lesson !== true)
              .map((lesson: any, idx: any) => (
                <div
                  onClick={() => handleChangeLesson(idx)}
                  key={lesson.id}
                  style={{ opacity: lesson.locked ? 0.5 : 1 }}
                  className={`flex cursor-pointer items-start relative justify-between cursor-pointer duration-200 transition-all ease-linear px-4 py-4 text-white border-b-1 border-gray-200 ${
                    activeLesson === idx
                    ? `bg-gray-100 border-l-5 ${
                        lesson.type === "avatar"
                          ? "border-l-orange-400"
                          : "border-l-blue-400"
                      }`
                    : ""
                  }`}
                >
                  <div className="flex h6-medium items-start gap-2 font-medium">
                    <span className="text-gray-800">{idx + 1}.</span>
                    <div className="flex flex-col gap-2">
                      <div className="capitalize text-gray-800">
                        <span
                          className="block overflow-wrap break-words whitespace-normal w-full pr-5 font-semibold"
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {lesson.title}
                        </span>
                        <p
                          className={`${
                            lesson.type === "avatar"
                              ? "text-orange-400"
                              : "text-blue-400"
                          }  text-xs`}
                        >
                          {lessonTypeText[lesson.type]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        <div
          className={`${
            showContent ? "w-[70%]" : "w-[100%]"
          } pr-5 py-2 border-1 rounded-lg bg-white my-element m-2 overflow-y-scroll`}
        >
          {!showContent && (
            <div className="flex justify-between items-center border-b-1 border-gray-200  w-full py-5 px-4">
              <div className="flex">
                <Icon
                  icon="gridicons:menus"
                  className="cursor-pointer text-gray-800 w-6 h-6"
                  onClick={() => setshowContent(true)}
                />
                <h1 className="text-[15px] text-gray-800 font-semibold pl-2">
                  Contents
                </h1>
              </div>
            </div>
          )}
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
  );
};

export default PreivewCourse;
