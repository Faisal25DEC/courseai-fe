"use client";

import { getCourse } from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import AvatarPracticeLesson from "../../components/AvatarLesson";
import { useParams } from "next/navigation";
const PreivewPractice = () => {
  const { lessonId } = useParams();
  
  console.log("lesson id ", typeof lessonId);
  // const currentCourseId = useRecoilValue(courseIdAtom);
  const currentCourseId = process.env.NEXT_PUBLIC_CURRENT_COURSE_ID as string;

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPracticeList, setIsPracticeList] = useState(false);

  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      console.log("lessons", res);

      const lesson = res.lessons.filter((ls: any) => ls.id == lessonId);

      console.log("filtered lesson", lesson);

      setLessonsArray(lesson);
      if (lesson.length > 0) {
        setActiveLesson(0);
      }
    });
  }, [currentCourseId, lessonId, setActiveLesson]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {lessonsArray[activeLesson]?.type === "avatar" && (
        <AvatarPracticeLesson
          lesson_id={lessonsArray[activeLesson].id}
          voice_id={lessonsArray[activeLesson].content?.voice_id}
          avatar_id={lessonsArray[activeLesson].content?.avatar_id}
          thumbnail={
            lessonsArray[activeLesson].content?.avatar?.normal_thumbnail_medium
          }
          avatar_name={lessonsArray[activeLesson].content?.avatar?.id}
          lesson={lessonsArray[activeLesson]}
          setIsPracticeList={setIsPracticeList}
        />
      )}
    </div>
  );
};

export default PreivewPractice;
