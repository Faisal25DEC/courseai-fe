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
import { Icon } from "@iconify/react";
import { typeColorObj } from "@/app/(courses-create)/courses/[id]/constants";
import AvatarPracticeLesson from "@/app/(practice)/practice/create/_components/avatar-lesson/avatar-lesson";
const PreivewPractice = ({setIsPracticeList}:any) => {
  // const currentCourseId = useRecoilValue(courseIdAtom);
  const currentCourseId = "6667760f255b05556e58b41a"

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      setLessonsArray(res.lessons);
    });
  }, [currentCourseId]);

  console.log("active lesson in preview ", activeLesson)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex w-[100%] h-[calc(90vh-120px)] relative mx-7">
        <div className="absolute cursor-pointer top-4 z-50 left-6"></div>
        <div className="w-full rounded-[20px]">
          {lessonsArray[activeLesson]?.type === "avatar" && (
            <AvatarPracticeLesson
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

export default PreivewPractice;
