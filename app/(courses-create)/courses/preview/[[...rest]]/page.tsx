"use client";
import {
  colors,
  currentCourseId,
  lessonTypeText,
  textFromBg,
} from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse } from "@/services/lesson.service";
import { activeLessonAtom, lessonsArrayAtom } from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import VideoLesson from "../_components/video-lesson/video-lesson";
import TextLesson from "../_components/text-lesson/text-lesson";
import AvatarLesson from "../_components/avatar-lesson/avatar-lesson";
import Tag from "@/components/shared/tag/tag";
import { typeColorObj } from "../../[id]/constants";
import { StringFormats } from "@/lib/StringFormats";
const PreivewCourse = () => {
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      setLessonsArray(res.lessons);
    });
  }, []);
  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-y-scroll">
      <div className="flex h-full w-[90%] mx-auto">
        <div className="min-w-max border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col gap-4 py-8">
          {lessonsArray.map((lesson: any, idx: any) => (
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
        <div className="w-full">
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreivewCourse;
