"use client";
import {
  colors,
  currentCourseId,
  lessonTypeText,
  textFromBg,
} from "@/lib/constants";
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
import { StringFormats } from "@/lib/StringFormats";

import { typeColorObj } from "./constants";
import Tag from "@/components/shared/tag/tag";

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
        <div className="min-w-max border-r-[1px] mr-4 h-full overflow-auto border-r-gray-200 flex flex-col gap-4 py-8 px-4">
          {filteredLessons.map((lesson: any, idx: any) => (
            <div
              onClick={() => handleChangeLesson(idx)}
              key={lesson.id}
              style={{ opacity: lesson.locked ? 0.5 : 1 }}
              className={`flex cursor-pointer items-start relative justify-between gap-2 hover:bg-gray-100 cursor-pointer duration-200 transition-all ease-linear px-4 py-2  rounded-[8px] ${
                activeLesson === idx ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex h6-medium items-start gap-2 font-medium">
                <span>{idx + 1} </span>
                <div className="flex flex-col gap-2">
                  <div className="">
                    {StringFormats.capitalizeFirstLetterOfEachWord(
                      lesson.title
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tag
                  color={textFromBg[typeColorObj[lesson.type]]}
                  bg={typeColorObj[lesson.type]}
                >
                  {lessonTypeText[lesson.type]}
                </Tag>
                {lesson.status === "rejected" && (
                  <Tag bg={colors.lightred}>Rejected</Tag>
                )}
                {/* <Tag>
                  {StringFormats.capitalizeFirstLetterOfEachWord(lesson.status)}
                </Tag> */}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full">
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
              lesson={filteredLessons[activeLesson]}
              voice_id={lessonsArray[activeLesson].content?.voice_id}
              avatar_id={lessonsArray[activeLesson].content?.avatar_id}
              thumbnail={
                lessonsArray[activeLesson].content?.avatar
                  ?.normal_thumbnail_medium
              }
              avatar_name={lessonsArray[activeLesson].content?.avatar?.id}
              lesson_id={lessonsArray[activeLesson].id}
            />
          )}
        </div>
      </div>
      <LessonLockedModal />
    </div>
  );
};

export default PreivewCourse;
