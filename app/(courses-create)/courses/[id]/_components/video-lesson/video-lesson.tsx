"use client";
import { Button } from "@/components/ui/button";
import { currentCourseId } from "@/lib/constants";
import {
  approveLessonRequest,
  getCourse,
  getUserAnalytics,
  updateLessonForUser,
} from "@/services/lesson.service";
import {
  activeLessonAtom,
  lessonsArrayAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import MuxPlayer from "@mux/mux-player-react";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

const VideoLesson = ({ video, lesson }: { video: any; lesson: any }) => {
  const { user } = useUser();
  const currenTimeRef = useRef<number>(0);
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  useEffect(() => {
    currenTimeRef.current = Date.now();
    const duration = Date.now() - currenTimeRef.current;
    return () => {
      if (lesson.status === "approved") return;
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson.id,

        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      });
    };
  }, [activeLesson]);
  const markComplete = () => {
    if (lesson.submission === "automatic") {
      updateLessonForUser({
        user_id: user?.id,
        course_id: currentCourseId,
        lesson_id: lesson.id,
        data: {
          status: "approved",
          duration: Date.now() - currenTimeRef.current,
          complete_at: Date.now(),
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
    <div className="h-full flex justify-center items-center relative">
      {video?.playback_id && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={video?.playback_id}
          className="!rounded-[20px] mux-player"
          autoPlay
        />
      )}
      <div className="absolute top-2 right-2">
        {lesson.status === "approved" ? (
          <Button variant={"outline"}>Completed</Button>
        ) : (
          <Button onClick={markComplete}>Mark Complete</Button>
        )}
      </div>
    </div>
  );
};

export default VideoLesson;
