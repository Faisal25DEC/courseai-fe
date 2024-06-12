"use client";
import { Button } from "@/components/ui/button";
import { currentCourseId } from "@/lib/constants";
import {
  approveLessonRequest,
  getCourse,
  updateLesson,
} from "@/services/lesson.service";
import { activeLessonAtom, lessonsArrayAtom } from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import MuxPlayer from "@mux/mux-player-react";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

const VideoLesson = ({ video, lesson }: { video: any; lesson: any }) => {
  const { user } = useUser();
  const currenTimeRef = useRef<number>(0);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  useEffect(() => {
    currenTimeRef.current = Date.now();

    return () => {
      const duration = Date.now() - currenTimeRef.current;
      console.log("Duration", duration);
    };
  }, [activeLesson]);
  const markComplete = () => {
    if (lesson.submission === "automatic") {
      updateLesson(currentCourseId, lesson.id, {
        submission_status: "approved",
      })
        .then(() => {
          getCourse(currentCourseId).then((res) => {
            setLessonsArray(res.lessons);
          });
        })
        .catch((err) => {
          toast.error("Failed to mark lesson as complete");
        });
    } else {
      updateLesson(currentCourseId, lesson.id, {
        submission_status: "approval-pending",
      })
        .then(() => {
          approveLessonRequest({
            lesson_id: lesson.id,
            course_id: currentCourseId,
            user_id: user?.id as string,
            status: "pending",
          }).then(() => {
            toast.success("Request sent for approval");
            getCourse(currentCourseId).then((res) => {
              setLessonsArray(res.lessons);
            });
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
        {lesson.submission_status === "approved" ? (
          <Button variant={"outline"}>Completed</Button>
        ) : (
          <Button onClick={markComplete}>Mark Complete</Button>
        )}
      </div>
    </div>
  );
};

export default VideoLesson;
