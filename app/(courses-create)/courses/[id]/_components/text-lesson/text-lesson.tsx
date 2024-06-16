"use client";
import { Button } from "@/components/ui/button";
import { currentCourseId } from "@/lib/constants";
import {
  approveLessonRequest,
  getCourse,
  getUserAnalytics,
  updateLesson,
  updateLessonForUser,
} from "@/services/lesson.service";
import {
  activeLessonAtom,
  lessonsArrayAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
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
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  const { user } = useUser();
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const currenTimeRef = React.useRef<number>(Date.now());
  useEffect(() => {
    return () => {
      const duration = Date.now() - currenTimeRef.current;
      if (lesson.status === "approved") return;
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson_id,

        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      }).then(() => {
        currenTimeRef.current = Date.now();
      });
      console.log("Duration", duration);
    };
  }, [activeLesson]);
  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        const duration = Date.now() - currenTimeRef.current;
        if (lesson.status === "approved") return;
        updateLessonForUser({
          course_id: currentCourseId,
          lesson_id: lesson_id,

          user_id: user?.id as string,
          data: {
            duration: duration,
          },
        }).then(() => {
          currenTimeRef.current = Date.now();
        });
        return;
      }
      currenTimeRef.current = Date.now();
    });
    return () => {
      document.removeEventListener("visibilitychange", () => {
        currenTimeRef.current = Date.now();
      });
    };
  }, []);
  const markComplete = () => {
    if (lesson.submission === "automatic") {
      updateLessonForUser({
        user_id: user?.id,
        course_id: currentCourseId,
        lesson_id: lesson.id,
        data: {
          status: "approved",
          duration: Date.now() - currenTimeRef.current,
          completed_at: Date.now(),
        },
      })
        .then(() => {
          getUserAnalytics(user?.id as string, currentCourseId).then((res) => {
            setUserAnalytics(res?.analytics);
          });
        })
        .catch((err) => {
          toast.error("Failed to mark lesson as complete");
        });
    } else {
      updateLessonForUser({
        user_id: user?.id,
        course_id: currentCourseId,
        lesson_id: lesson.id,
        data: {
          status: "approval-pending",
          duration: Date.now() - currenTimeRef.current,
        },
      })
        .then(() => {
          approveLessonRequest({
            lesson_id: lesson.id,
            course_id: currentCourseId,
            user_id: user?.id as string,
            status: "pending",
          }).then(() => {
            toast.success("Request sent for approval");
            getUserAnalytics(user?.id as string, currentCourseId).then(
              (res) => {
                setUserAnalytics(res?.analytics);
              }
            );
          });
        })
        .catch((err) => {
          toast.error("Failed to send request for approval");
        });
    }
  };
  return (
    <div className="py-4 h-full overflow-auto relative">
      <Editor
        editable={false}
        onChange={() => null}
        initialContent={content.text}
      />
      <div className="absolute top-2 right-2">
        {lesson.status === "approved" ? (
          <Button variant={"outline"}>Completed</Button>
        ) : lesson.status === "approval-pending" ? (
          <Button>Approval Pending</Button>
        ) : (
          <Button onClick={markComplete}>Mark Complete</Button>
        )}
      </div>
    </div>
  );
};

export default TextLesson;
