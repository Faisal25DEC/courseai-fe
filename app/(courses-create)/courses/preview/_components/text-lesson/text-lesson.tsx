"use client";
import { currentCourseId } from "@/lib/constants";
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
    <div className="py-4 h-full overflow-auto">
      <Editor
        editable={false}
        onChange={() => null}
        initialContent={lesson.text}
      />
    </div>
  );
};

export default TextLesson;
