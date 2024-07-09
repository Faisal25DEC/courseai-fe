"use client";

import { getCourse } from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import AvatarPracticeLesson from "@/app/(practice)/practice/create/_components/avatar-lesson/avatar-lesson";
const PreivewPractice = ({setIsPracticeList}:any) => {
  // const currentCourseId = useRecoilValue(courseIdAtom);
  const currentCourseId = process.env.NEXT_PUBLIC_CURRENT_COURSE_ID as string

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      setLessonsArray(res.lessons);
    });
  }, [currentCourseId]);

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
