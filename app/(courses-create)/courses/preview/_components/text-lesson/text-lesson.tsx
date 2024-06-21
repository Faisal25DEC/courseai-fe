"use client";
import { currentCourseId } from "@/lib/constants";
import { StringFormats } from "@/lib/StringFormats";
import { updateLessonForUser } from "@/services/lesson.service";
import { activeLessonAtom } from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
const TextLesson = ({ lesson, lesson_id }: { lesson: any; lesson_id: any }) => {
  const { user } = useUser();
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const currenTimeRef = React.useRef<number>(0);
  useEffect(() => {
    currenTimeRef.current = Date.now();

    return () => {
      const duration = Date.now() - currenTimeRef.current;
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson_id,

        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      });
      console.log("Duration", duration);
    };
  }, [activeLesson]);
  return (
    <div className="py-4 h-full flex flex-col items-center overflow-auto relative">
      <div className="w-[900px] flex flex-col gap-3 relative">
        <div className="flex gap-2 items-center justify-between">
          <h1 className="h1-medium self-start pl-12">
            {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
          </h1>
        </div>
        <div className="flex flex-col gap-2 pl-[50px]">
          <p className="text-gray-600 text-[16px]">{lesson?.description}</p>
        </div>
        <Editor
          editable={false}
          onChange={() => null}
          initialContent={lesson?.content?.text}
        />
      </div>
    </div>
  );
};

export default TextLesson;
