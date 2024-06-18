"use client";
import { Button } from "@/components/ui/button";
import { currentCourseId } from "@/lib/constants";
import { StringFormats } from "@/lib/StringFormats";
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
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

const VideoLesson = ({ video, lesson }: { video: any; lesson: any }) => {
  const { user } = useUser();
  const currenTimeRef = useRef<number>(Date.now());
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [isDocumentVisible, setIsDocumentVisible] = useState(!document.hidden);
  useEffect(() => {
    if (lesson.status === "rejected") {
      toast.error("Admin has rejected the approval request.");
      toast.dismiss();
    }
    return () => {
      if (!user) return;
      const duration = Date.now() - currenTimeRef.current;
      console.log("duration", duration);
      if (lesson.status === "approved") return;
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson.id,

        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      }).then(() => {
        currenTimeRef.current = Date.now();
      });
    };
  }, []);

  useEffect(() => {
    setIsDocumentVisible(!document.hidden);
  }, []);

  useEffect(() => {
    if (!isDocumentVisible && user && lesson.status !== "approved") {
      const duration = Date.now() - currenTimeRef.current;
      console.log("duration2", duration);
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson.id,
        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      }).then(() => {
        currenTimeRef.current = Date.now();
      });
    }
  }, [isDocumentVisible, user, lesson.id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    <div className="h-full flex flex-col w-[900px] gap-6 justify-center mx-auto relative px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] text-gray-700 font-medium px-4 py-2 relative">
          {StringFormats.capitalizeFirstLetterOfEachWord(lesson.title)}
        </h1>
        <div className=" top-2 right-2">
          {lesson.status === "approved" ? (
            <Button variant={"outline"}>Completed</Button>
          ) : (
            <Button onClick={markComplete}>Mark Complete</Button>
          )}
        </div>
      </div>
      {video?.playback_id && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={video?.playback_id}
          className="!rounded-[20px] w-full self-center"
          autoPlay
        />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="h2-medium">Description</h1>
        <p className="p-light">{lesson?.description}</p>
      </div>
    </div>
  );
};

export default VideoLesson;
