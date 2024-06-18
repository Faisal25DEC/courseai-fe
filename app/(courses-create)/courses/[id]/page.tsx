"use client";
import { currentCourseId } from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse, getUserAnalytics } from "@/services/lesson.service";
import {
  activeLessonAtom,
  lessonsArrayAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import VideoLesson from "./_components/video-lesson/video-lesson";
import TextLesson from "./_components/text-lesson/text-lesson";
import AvatarLesson from "./_components/avatar-lesson/avatar-lesson";
import { useParams } from "next/navigation";
import useLessonLockedModal from "@/hooks/useLessonLockedModal";
import LessonLockedModal from "./_components/lesson-locked-modal/lesson-locked-modal";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import useFetchLessons from "@/hooks/useFetchLesson";

const PreivewCourse = () => {
  const [lessonsArray, setLessonsArray] = useFetchLessons(currentCourseId);
  const { user } = useUser();
  const { id } = useParams();
  const {
    isLessonLockedModalOpen,
    onLessonLockedModalOpen,
    onLessonLockedModalClose,
  } = useLessonLockedModal();
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  useEffect(() => {
    if (!user && userAnalytics === null) return;
    getCourse(id as string)
      .then((res) => {
        getUserAnalytics(user?.id as string, currentCourseId).then(
          (analyticsRes) => {
            setUserAnalytics(analyticsRes?.analytics);
          }
        );
        setLessonsArray(res.lessons);
      })
      .catch(() => {
        toast.error("Failed to fetch course");
      });
  }, [user]);

  const checkIfLessonIsLocked = (idx: number) => {
    if (idx === 0) return false;
    for (let j = idx - 1; j >= 0; j--) {
      const lessonId = lessonsArray[j].id;

      if (userAnalytics?.[lessonId] === null) return true;
      if (userAnalytics?.[lessonId]?.status !== "approved") return true;
    }
    return false;
  };
  const handleChangeLesson = (idx: number) => {
    if (checkIfLessonIsLocked(idx)) {
      onLessonLockedModalOpen();
      return;
    } else {
      setActiveLesson(idx);
    }
  };
  const getLockedLessons = (lessonsArray: any) => {
    const lockedLessons = [];
    for (let i = 0; i < lessonsArray.length; i++) {
      lockedLessons.push({
        ...lessonsArray[i],
        status: userAnalytics?.[lessonsArray[i].id]?.status || "pending",
        locked: checkIfLessonIsLocked(i),
      });
    }
    return lockedLessons;
  };
  const filteredLessons = getLockedLessons(lessonsArray);
  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-y-scroll">
      <div className="flex h-full w-[90%] mx-auto">
        <div className="w-[200px] border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col gap-4 py-8">
          {filteredLessons.map((lesson: any, idx: any) => (
            <div
              onClick={() => handleChangeLesson(idx)}
              key={lesson.id}
              style={{ opacity: lesson.locked ? 0.5 : 1 }}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              {lesson.type === "video" && (
                <div className="relative">
                  <img
                    src={getVideoThumbnail(lesson.content.playback_id)}
                    alt="thumbnail"
                    className="w-[120px] h-[120px] rounded-[12px] object-cover"
                  />
                  {lesson.status === "rejected" && (
                    <div className="absolute top-2 right-2 p-2 rounded-[12px] text-[12px] text-white bg-red-500">
                      Rejected
                    </div>
                  )}
                </div>
              )}
              {lesson.type === "avatar" && (
                <div className="relative">
                  <img
                    src={lesson.content.avatar.normal_thumbnail_medium}
                    alt="thumbnail"
                    className="w-[120px] h-[120px] rounded-[12px] object-cover"
                  />
                  {lesson.status === "rejected" && (
                    <div className="absolute top-2 right-2 px-2 py-[1px] rounded-[12px] text-[12px] text-white bg-red-500">
                      Rejected
                    </div>
                  )}
                </div>
              )}
              {lesson.type === "text" && (
                <div className=" relative rounded-[12px] flex justify-center items-center">
                  <img
                    className="w-[120px] h-[120px] rounded-[12px] object-cover border-[1px] border-gray-100"
                    src="/images/doc-icon.png"
                  />
                  {lesson.status === "rejected" && (
                    <div className="absolute top-2 right-2 px-2 py-[1px] rounded-[12px] text-[12px] text-white bg-red-500">
                      Rejected
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="text-sm font-normal text-gray-700">
                  {lesson.title}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[calc(100%-200px)]">
          {lessonsArray[activeLesson]?.type === "video" && (
            <VideoLesson
              video={lessonsArray[activeLesson].content}
              lesson={filteredLessons[activeLesson]}
            />
          )}
          {lessonsArray[activeLesson]?.type === "text" && (
            <TextLesson
              content={lessonsArray[activeLesson].content}
              lesson_id={lessonsArray[activeLesson].id}
              lesson={filteredLessons[activeLesson]}
            />
          )}
          {lessonsArray[activeLesson]?.type === "avatar" && (
            <AvatarLesson
              voice_id={lessonsArray[activeLesson].content?.voice_id}
              avatar_id={lessonsArray[activeLesson].content?.avatar_id}
              thumbnail={
                lessonsArray[activeLesson].content?.avatar
                  ?.normal_thumbnail_medium
              }
              avatar_name={lessonsArray[activeLesson].content?.avatar?.id}
              lesson_id={lessonsArray[activeLesson].id}
              lesson={filteredLessons[activeLesson]}
            />
          )}
        </div>
      </div>
      <LessonLockedModal />
    </div>
  );
};

export default PreivewCourse;
