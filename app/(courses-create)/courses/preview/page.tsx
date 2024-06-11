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
const PreivewCourse = () => {
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  useEffect(() => {
    getCourse(currentCourseId).then((res) => {
      setLessonsArray(res.lessons);
    });
  }, []);
  const handleChangeLesson = (idx: number) => {
    setActiveLesson(idx);
  };
  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-y-scroll">
      <div className="flex h-full w-[90%] mx-auto">
        <div className="w-[200px] border-r-[1px] h-full overflow-auto border-r-gray-200 flex flex-col gap-4 py-8">
          {lessonsArray.map((lesson: any, idx: any) => (
            <div
              onClick={() => handleChangeLesson(idx)}
              key={lesson.id}
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
              <div className="text-sm font-normal text-gray-700">
                {lesson.title}
              </div>
            </div>
          ))}
        </div>
        <div className="w-[calc(100%-200px)]">
          {lessonsArray[activeLesson]?.type === "video" && (
            <VideoLesson video={lessonsArray[activeLesson].content} />
          )}
          {lessonsArray[activeLesson]?.type === "text" && (
            <TextLesson lesson={lessonsArray[activeLesson].content} />
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
    </div>
  );
};

export default PreivewCourse;
