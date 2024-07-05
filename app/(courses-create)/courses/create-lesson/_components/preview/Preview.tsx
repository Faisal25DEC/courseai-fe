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
import VideoLesson from "../../../[id]/_components/video-lesson/video-lesson";
import TextLesson from "../../../preview/_components/text-lesson/text-lesson";
import AvatarLesson from "../../../preview/_components/avatar-lesson/avatar-lesson";
import { typeColorObj } from "../../../[id]/constants";
const PreivewLesson = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      const practiceLessons = res.lessons.filter((lesson:any) => lesson.is_practice_lesson !== true);
      setLessonsArray(practiceLessons);
    });
  }, [currentCourseId]);

  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  return (
    <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center overflow-y-scroll my-element ">
      <div className="flex w-[100%] h-[calc(90vh-120px)] relative">
        
        <div className="w-full border shadow-1 rounded-[20px] border-gray-200 bg-white">
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

export default PreivewLesson;
