import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import { StringFormats } from "@/lib/StringFormats";
import {
  currentUserLessonAnalyticsAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React from "react";
import { useRecoilState } from "recoil";
import { textColorBasedOnStatus } from "./constants";

const UserLessonAnalytics = () => {
  const [lessonsArray, setLessonsArray] = useRecoilState(lessonsArrayAtom);
  const [currentUserLessonAnalytics, setCurrentUserLessonAnalytics] =
    useRecoilState(currentUserLessonAnalyticsAtom);

  console.log(currentUserLessonAnalytics);

  const getUserLessonAnalyticsArray = (
    currentUserAnalytics: any,
    lessonsArray: any
  ) => {
    let lessonAnalyticsArrayAns: any = [];
    lessonsArray.forEach((lesson: any) => {
      lessonAnalyticsArrayAns.push({
        ...lesson,
        ...currentUserAnalytics.analytics?.[lesson.id],
      });
    });
    return lessonAnalyticsArrayAns;
  };

  const lessonAnalyticsArray = getUserLessonAnalyticsArray(
    currentUserLessonAnalytics,
    lessonsArray
  );

  const headings = ["Lesson", "Status", "Time Spent", "Progress"];

  return (
    <div className="">
      <div className="flex items-center gap-4 p-4">
        <div>
          <img
            src={currentUserLessonAnalytics?.imageUrl}
            className="w-[40px] h-[40px] object-cover rounded-full"
          />
        </div>
        <div>
          <p className="text-lg font-normal text-gray-700">
            {currentUserLessonAnalytics?.firstName}{" "}
            {currentUserLessonAnalytics?.lastName}&apos;s Analytics
          </p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center py-4 px-6 text-sm font-normal">
        {headings.map((heading) => {
          return (
            <div key={heading} className="w-[25%]">
              <p>{heading}</p>
            </div>
          );
        })}
      </div>
      {lessonAnalyticsArray.map((lesson: any) => {
        return (
          <div
            key={lesson.id}
            className="py-4 px-6 border-b border-gray-200 rounded-b-[20px] cursor-pointer flex justify-between items-center rounded-md"
          >
            <div className="w-[25%]">
              <p>{lesson.title}</p>
            </div>
            <div className="w-[25%]">
              <p
                className={`${
                  textColorBasedOnStatus[lesson.status || "pending"]
                } text-[13px]`}
              >
                {StringFormats.capitalizeFirstLetterOfEachWord(
                  lesson?.status
                ) || "Pending"}
              </p>
            </div>
            <div className="w-[25%]">
              <p className="text-[13px]">
                {FormatDate.formatMilliseconds(lesson.duration) === "0 seconds"
                  ? "Yet To Start"
                  : FormatDate.formatMilliseconds(lesson.duration) ||
                    "Yet To Start"}
              </p>
            </div>
            <div className="w-[25%]">
              <p className="text-[13px]">
                {lesson.completed_at
                  ? FormatDate.getDateInDDMMYYYY(lesson.completed_at)
                  : "Yet To Start"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserLessonAnalytics;
