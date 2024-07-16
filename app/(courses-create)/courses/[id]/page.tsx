"use client";
import { colors, lessonTypeText, textFromBg } from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import {
  getCourse,
  getUserAnalytics,
  updateLessonForUser,
} from "@/services/lesson.service";
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
import { Chip, Progress } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const PreivewCourse = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [lessonsArray, setLessonsArray] = useFetchLessons(currentCourseId);
  
  const [isPracticeList, setIsPracticeList] = useState(true);
  const [showContent, setshowContent] = useState(true);

  const { user } = useUser();

  const currenTimeRef = React.useRef<number>(Date.now());

  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  useEffect(() => {
    getUserAnalytics(user?.id as string, currentCourseId).then(
      (analyticsRes) => {
        setUserAnalytics(analyticsRes?.analytics);
      }
    );

    return()=>{
      setLessonsArray([])
    }
  }, []);

  const checkIfLessonIsLocked = (idx: number) => {
    if (idx === 0) return false;
    for (let j = idx - 1; j >= 0; j--) {
      const lessonId = lessonsArray[j].id;
      if (userAnalytics?.[lessonId] === null) {
        console.log(`Lesson ${lessonId} is locked because analytics is null.`);
        return true;
      }
      if (userAnalytics?.[lessonId]?.status !== "approved") {
        console.log(
          `Lesson ${lessonId} is locked because status is not approved.`
        );
        return true;
      }
    }
    console.log(`Lesson ${lessonsArray[idx].id} is not locked.`);
    return false;
  };

  const areAllLessonsLocked = () => {
    console.log(
      "areAllLessonsLocked ",
      !lessonsArray.every((lesson: any, idx: any) => checkIfLessonIsLocked(idx))
    );
    return !lessonsArray.every((lesson: any, idx: any) =>
      checkIfLessonIsLocked(idx)
    );
  };

  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  const getLockedLessons = (lessonsArray: any) => {
    const filteredLessonsArray = lessonsArray.filter(
      (lesson: any) => lesson.is_practice_lesson === false
    );

    const lockedLessons = filteredLessonsArray.map(
      (lesson: any, index: number) => ({
        ...lesson,
        status: userAnalytics?.[lesson.id]?.status || "pending",
        locked: checkIfLessonIsLocked(index),
      })
    );

    return lockedLessons;
  };

  const filteredLessons = getLockedLessons(lessonsArray);

  const locked_lessons = filteredLessons.filter(
    (ls: any) => ls.locked === false && ls.is_practice_lesson === false
  );

  const filteredLessonsArray = lessonsArray.filter(
    (lesson: any) => lesson.is_practice_lesson === false
  );

  const myCompletion =
    ((locked_lessons.length - 1) / filteredLessonsArray.length) * 100;

  console.log("myCompletion", myCompletion, locked_lessons);

  const markComplete = (lesson: any) => {
    currenTimeRef.current = Date.now();

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

        if (areAllLessonsLocked()) {
          updateLessonForUser({
            user_id: user?.id,
            course_id: currentCourseId,
            lesson_id: lesson.id,
            data: {
              course_status: "approval-pending",
            },
          });
        }
      })
      .catch((err) => {
        toast.error("Failed to mark lesson as complete");
      });
  };

  // useEffect(() => {
  //   if (areAllLessonsLocked()) {
  //     toast.success("All lessons are locked.");
  //   }
  // }, [lessonsArray, userAnalytics]);

  return (
    <div className="w-full h-[100vh] overflow-hidden">
      <div className="flex h-full w-[100%]">
        {showContent && (
          <div className="w-[40%] border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col my-element bg-white">
            <div className="flex justify-between items-center border-b-1 border-gray-200  w-full py-5 px-4">
              <div className="flex ">
                <Icon icon="gridicons:menus" className="text-gray-800 w-6 h-6" />
                <h1 className="text-[15px] text-gray-800 font-semibold pl-2">
                  Contents
                </h1>
              </div>
              <Icon
                onClick={() => setshowContent(false)}
                icon="carbon:close-outline"
                className="cursor-pointer w-7 h-7 text-gray-800"
              />
            </div>
            {lessonsArray
              .filter((ls: any) => ls.is_practice_lesson === false)
              .map((lesson: any, idx: any) => (
                <div
                  onClick={() => handleChangeLesson(idx)}
                  key={lesson.id}
                  style={{ opacity: lesson.locked ? 0.5 : 1 }}
                  className={`flex cursor-pointer items-start relative justify-between cursor-pointer duration-200 transition-all ease-linear px-4 py-4 text-white border-b-1 border-gray-200 ${
                    activeLesson === idx
                    ? `bg-gray-100 border-l-5 ${
                        lesson.type === "avatar"
                          ? "border-l-orange-400"
                          : "border-l-blue-400"
                      }`
                    : ""
                  }`}
                >
                  <div className="flex h6-medium items-start gap-2 font-medium">
                    <span className="text-gray-800">{idx + 1}.</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col w-fit capitalize text-gray-800">
                      <span
                        className="block overflow-wrap break-words whitespace-normal w-full pr-5 font-semibold text-gray-700"
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {lesson.title}
                      </span>

                      <p
                        className={`${
                          lesson.type === "avatar"
                            ? "text-orange-400"
                            : "text-blue-400"
                        } text-xs`}
                      >
                        {lessonTypeText[lesson.type]}
                      </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {filteredLessons[idx].status === "approved" ? (
                      <Icon icon="mingcute:bookmark-fill" className="w-5 h-5 text-gray-800" />
                    ) : (
                      <Icon
                        icon="uil:bookmark"
                        className="w-5 h-5 text-gray-800"
                        onClick={() => {
                          markComplete(lesson);
                        }}
                      />
                    )}
                    {/* )} */}
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className="flex flex-col w-full px-4">
          <div className="pt-5">
            <h1 className="text-gray-500 text-[15px] font-semibold pb-2">
              My completion
            </h1>
            <Progress
              aria-label="Downloading..."
              size="sm"
              value={myCompletion}
              color="success"
              showValueLabel={true}
              className="max-w-md"
            />
          </div>
          <div className="overflow-auto w-full pr-5 py-2 border-1 rounded-lg bg-white my-4 my-element">
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
      </div>
      <LessonLockedModal />
    </div>
  );
};

export default PreivewCourse;
