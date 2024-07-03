"use client";
import {
  colors,
  lessonTypeText,
  textFromBg,
} from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse } from "@/services/lesson.service";
import { activeLessonAtom, courseIdAtom, lessonsArrayAtom } from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import Tag from "@/components/shared/tag/tag";

import { StringFormats } from "@/lib/StringFormats";
import { Icon } from "@iconify/react";
import { typeColorObj } from "@/app/(courses-create)/courses/[id]/constants";
import AvatarLesson from "@/app/(courses-create)/courses/[id]/_components/avatar-lesson/avatar-lesson";
const PreivewCourse = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      const practiceLessons = res.lessons.filter((lesson:any) => lesson.is_practice_lesson === true);
      setLessonsArray(practiceLessons);
    });
  }, [currentCourseId]);
  
  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  return (
    <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center overflow-y-scroll">
      <div className="flex w-[70%] h-[calc(90vh-120px)] relative mx-auto">
        <div className="absolute cursor-pointer top-4 z-50 left-6">
          <div
            className="p-2 rounded-[10px] flex items-center gap-2 bg-white shadow-1 w-[300px]"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Icon icon="quill:hamburger" />
            <p>{lessonsArray[activeLesson]?.title}</p>
          </div>
          {isMenuOpen && (
            <div className="max-w-[300px] shadow-1 mt-2 bg-white a rounded-[20px] px-2 py-8 h-full overflow-auto flex flex-col gap-4">
              {lessonsArray
                .filter((lessons: any) => lessons.is_practice_lesson === true)
                .map((lesson: any, idx: any) => (
                  <div
                    onClick={() => handleChangeLesson(idx)}
                    key={lesson.id}
                    style={{ opacity: lesson.locked ? 0.5 : 1 }}
                    className={`flex cursor-pointer items-start relative justify-between gap-2 hover:bg-gray-100 cursor-pointer duration-200 transition-all ease-linear px-4 py-2  rounded-[8px] ${
                      activeLesson === idx ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex h6-medium items-start gap-2 font-medium">
                      <span>{idx + 1} </span>
                      <div className="flex flex-col gap-2">
                        <div className="">
                          {StringFormats.capitalizeFirstLetterOfEachWord(
                            lesson.title
                          )?.slice(0, 30)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag
                        color={textFromBg[typeColorObj[lesson.type]]}
                        bg={typeColorObj[lesson.type]}
                      >
                        {lessonTypeText[lesson.type]}
                      </Tag>
                      {/* {lesson.status === "rejected" && (
                  <Tag bg={colors.lightred}>Rejected</Tag>
                )} */}
                      {/* <Tag>
                {StringFormats.capitalizeFirstLetterOfEachWord(lesson.status)}
              </Tag> */}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="w-full border shadow-1 rounded-[20px]  border-gray-200">

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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreivewCourse;
