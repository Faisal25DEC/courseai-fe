"use client";
import { colors, lessonTypeText, textFromBg } from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse, getUserAnalytics } from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  lessonsArrayAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
import { Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const PreivewCourse = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [lessonsArray, setLessonsArray] = useFetchLessons(currentCourseId);
  const [isPracticeList, setIsPracticeList] = useState(true);
  const [showContent, setshowContent] = useState(true);

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
    <div className="w-full h-[100vh] overflow-hidden">
      <div className="flex h-full w-[100%]">
        {showContent && (
          <div className="w-[40%] border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col bg-gray-800 my-element">
            <div className="flex justify-between items-center border-b-1 border-gray-600  w-full py-5 px-4">
              <div className="flex ">
                <Icon icon="gridicons:menus" className="text-white w-6 h-6" />
                <h1 className="text-[15px] text-gray-300 font-semibold pl-2">
                  Contents
                </h1>
              </div>
              <Icon
                onClick={() => setshowContent(false)}
                icon="carbon:close-outline"
                className="cursor-pointer w-7 h-7 text-white"
              />
            </div>
            {filteredLessons.map((lesson: any, idx: any) => (
              <div
                onClick={() => handleChangeLesson(idx)}
                key={lesson.id}
                style={{ opacity: lesson.locked ? 0.5 : 1 }}
                className={`flex cursor-pointer items-start relative justify-between cursor-pointer duration-200 transition-all ease-linear px-4 py-4 text-white border-b-1 border-gray-600 ${
                  activeLesson === idx
                    ? "bg-black border-l-5 border-l-white"
                    : ""
                }`}
              >
                <div className="flex h6-medium items-start gap-2 font-medium">
                  <span className="text-gray-300">{idx + 1}.</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col w-fit capitalize text-gray-300">
                      {lesson.title?.slice(0, 30)}
                      <p
                        className={`${
                          lesson.type === "avatar"
                            ? "text-orange-200"
                            : "text-blue-200"
                        }  text-xs`}
                      >
                        {lessonTypeText[lesson.type]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {lesson.locked ? (
                    <Icon icon="ic:round-lock" className="w-5 h-5" />
                  ) : (
                    <Icon icon="uil:bookmark" className="w-5 h-5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="overflow-auto w-full pr-5 py-2 border-1 rounded-lg bg-white mx-5 my-4 my-element">
          {!showContent && (
            <div className="flex justify-between items-center border-b-1 border-gray-200  w-full py-5 px-4">
              <div className="flex">
                <Icon
                  icon="gridicons:menus"
                  className="cursor-pointer text-gray-800 w-6 h-6"
                  onClick={() => setshowContent(true)}
                />
                <h1 className="text-[15px] text-gray-800 font-semibold pl-2">
                  Contents
                </h1>
              </div>
            </div>
          )}
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
              setIsPracticeList={setIsPracticeList}
            />
          )}
        </div>
      </div>
      <LessonLockedModal />
    </div>
  );
};

export default PreivewCourse;
