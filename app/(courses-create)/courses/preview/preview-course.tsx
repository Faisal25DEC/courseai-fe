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
import { Chip } from "@nextui-org/react";
const PreivewCourse = () => {
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [isPracticeList, setIsPracticeList] = useState<any>(true);
  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      setLessonsArray(res.lessons);
    });
  }, []);
  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  return (
    <div className="w-full h-[92vh] overflow-y-scroll border-1">
      <div className="flex h-full w-[90%] mx-auto">
        <div className="min-w-max border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col gap-4 py-8 pr-7">
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
                <span>{idx + 1}.</span>
                <div className="flex flex-col gap-2">
                  <div className="">{lesson.title?.slice(0, 30)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Chip
                  className={`${
                    lesson.type === "avatar"
                      ? "bg-orange-100 text-orange-500 border-orange-500"
                      : "bg-blue-100 text-blue-500 border-blue-500"
                  } text-xs border-1`}
                >
                  {" "}
                  {lessonTypeText[lesson.type]}
                </Chip>
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
              setIsPracticeList={setIsPracticeList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreivewCourse;
