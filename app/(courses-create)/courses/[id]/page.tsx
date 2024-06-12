"use client";
import { currentCourseId } from "@/lib/constants";
import { getVideoThumbnail } from "@/lib/MuxHelpers/MuxHelpers";
import { getCourse } from "@/services/lesson.service";
import { activeLessonAtom, lessonsArrayAtom } from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import VideoLesson from "./_components/video-lesson/video-lesson";
import TextLesson from "./_components/text-lesson/text-lesson";
import AvatarLesson from "./_components/avatar-lesson/avatar-lesson";
import { useParams } from "next/navigation";
import useLessonLockedModal from "@/hooks/useLessonLockedModal";
import LessonLockedModal from "./_components/lesson-locked-modal/lesson-locked-modal";

const PreivewCourse = () => {
  const { id } = useParams();
  const {
    isLessonLockedModalOpen,
    onLessonLockedModalOpen,
    onLessonLockedModalClose,
  } = useLessonLockedModal();
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  useEffect(() => {
    getCourse(id as string).then((res) => {
      setLessonsArray(res.lessons);
      setActiveLesson(0);
    });
  }, []);
  const handleChangeLesson = (idx: number) => {
    if (idx > 0) {
      if (lessonsArray[idx - 1].submission_status === "pending") {
        onLessonLockedModalOpen();
        return;
      }
    }
    setActiveLesson(idx);
  };
  const checkIfLessonIsLocked = (idx: number) => {
    if (idx === 0) return false;
    for (let j = idx - 1; j >= 0; j--) {
      if (lessonsArray[j]?.submission_status !== "approved") {
        return true;
      }
    }
    return false;
  };
  const getLockedLessons = (lessonsArray: any) => {
    const lockedLessons = [];
    for (let i = 0; i < lessonsArray.length; i++) {
      lockedLessons.push({
        ...lessonsArray[i],
        locked: checkIfLessonIsLocked(i),
      });
    }
    return lockedLessons;
  };
  const filteredLessons = getLockedLessons(lessonsArray);
  console.log(filteredLessons);
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
                <img
                  src={getVideoThumbnail(lesson.content.playback_id)}
                  alt="thumbnail"
                  className="w-[120px] h-[120px] rounded-[12px] object-cover"
                />
              )}
              {lesson.type === "avatar" && (
                <img
                  src={lesson.content.avatar.normal_thumbnail_medium}
                  alt="thumbnail"
                  className="w-[120px] h-[120px] rounded-[12px] object-cover"
                />
              )}
              {lesson.type === "text" && (
                <div className="w-[120px] h-[120px] rounded-[12px] flex justify-center items-center">
                  <img
                    className="w-[120px] h-[120px] rounded-[12px] object-cover border-[1px] border-gray-100"
                    src="/images/doc-icon.png"
                  />
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
              lesson={lessonsArray[activeLesson]}
            />
          )}
          {lessonsArray[activeLesson]?.type === "text" && (
            <TextLesson
              content={lessonsArray[activeLesson].content}
              lesson_id={lessonsArray[activeLesson].id}
              lesson={lessonsArray[activeLesson]}
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
            />
          )}
        </div>
      </div>
      <LessonLockedModal />
    </div>
  );
};

export default PreivewCourse;
