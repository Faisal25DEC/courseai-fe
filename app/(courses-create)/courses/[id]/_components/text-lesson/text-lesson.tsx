"use client";
import { Button } from "@/components/ui/button";
import { StringFormats } from "@/lib/StringFormats";
import {
  approveLessonRequest,
  getCourse,
  getUserAnalytics,
  updateLesson,
  updateLessonForUser,
} from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  lessonsArrayAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
const TextLesson = ({
  content,
  lesson_id,
  lesson,
}: {
  lesson: any;
  lesson_id: any;
  content: any;
}) => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  const { user } = useUser();
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const currenTimeRef = React.useRef<number>(Date.now());
  const [isDocumentVisible, setIsDocumentVisible] = useState(!document.hidden);
  // useEffect(() => {
  //   return () => {
  //     if (!user) return;
  //     const duration = Date.now() - currenTimeRef.current;
  //     if (lesson.status === "approved") return;
  //     updateLessonForUser({
  //       course_id: currentCourseId,
  //       lesson_id: lesson.id,

  //       user_id: user?.id as string,
  //       data: {
  //         duration: duration,
  //       },
  //     }).then(() => {
  //       currenTimeRef.current = Date.now();
  //     });
  //   };
  // }, []);

  // useEffect(() => {
  //   if (lesson.status === "rejected") {
  //     toast.error("Admin has rejected the approval request.");
  //     toast.dismiss();
  //   }
  // }, [lesson]);

  // useEffect(() => {
  //   setIsDocumentVisible(!document.hidden);
  // }, []);

  // useEffect(() => {
  //   if (!isDocumentVisible && user && lesson.status !== "approved") {
  //     const duration = Date.now() - currenTimeRef.current;
  //     updateLessonForUser({
  //       course_id: currentCourseId,
  //       lesson_id: lesson.id,
  //       user_id: user?.id as string,
  //       data: {
  //         duration: duration,
  //       },
  //     }).then(() => {
  //       currenTimeRef.current = Date.now();
  //     });
  //   }
  // }, [isDocumentVisible, user, lesson.id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="py-4 h-full flex flex-col items-center overflow-auto relative">
      <div className="w-full flex flex-col gap-3 relative">
        <div className="flex gap-2 items-center justify-between">
          <h1 className="h1-medium self-start pl-12">
            {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
          </h1>
          <div className="absolute top-2 right-2">
            {/* {lesson.status === "approved" ? (
              <Button variant={"outline"}>Completed</Button>
            ) : lesson.status === "approval-pending" ? (
              <Button>Approval Pending</Button>
            ) : (
              <Button onClick={markComplete}>Mark Complete</Button>
            )} */}
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-[51px]">
          <p className="text-gray-600 text-[16px]">{lesson?.description}</p>
        </div>
        <Editor
          editable={false}
          onChange={() => null}
          initialContent={content.text}
        />
      </div>
    </div>
  );
};

export default TextLesson;
