import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import { StringFormats } from "@/lib/StringFormats";
import {
  analyticsTabValueAtom,
  currentAvatarConversationAtom,
  currentUserLessonAnalyticsAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { textColorBasedOnStatus } from "./constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import ApprovalPending from "./_legos/approval-pending/approval-pending";
import {
  analyticsTabsValues,
  lessonStatuses,
  lessonStatusText,
} from "@/lib/constants";

const UserLessonAnalytics = () => {
  const [currentAvatarConversation, setCurrentAvatarConversation] =
    useRecoilState(currentAvatarConversationAtom);
  const [tabValue, setTabValue] = useRecoilState(analyticsTabValueAtom);
  const { approvalPending, approved, pending } = lessonStatuses;
  const [lessonsArray, setLessonsArray] = useRecoilState(lessonsArrayAtom);
  const [currentUserLessonAnalytics, setCurrentUserLessonAnalytics] =
    useRecoilState(currentUserLessonAnalyticsAtom);
  const [isPractice, setIsPractice] = useState(false);

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
  const getRecordingsCount = (lesson: any) => {
    if (lesson?.type !== "avatar") {
      return "-";
    }
    return lesson?.conversations?.length > 0
      ? `${lesson?.conversations?.length} recordings`
      : "No recordings";
  };
  const viewRecordings = (lesson: any) => {
    if (lesson?.type !== "avatar") {
      return null;
    }

    setCurrentAvatarConversation(lesson?.conversations);
    setTabValue(analyticsTabsValues.avatarConversations);
  };
  const getClassNames = (lesson: any) => {
    if (lesson?.type !== "avatar") {
      return "text-gray-400";
    }
    return "text-blue-600 underline font-light";
  };

  const headings = [
    "Lesson",
    "Status",
    "Time Spent",
    "Completed At",
    "Recordings",
  ];
  console.log("analytics ", lessonAnalyticsArray);
  return (
    <div className="min-h-[80vh] min-w-[990px]">
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
      <div className="flex justify-center px-5 py-5">
        <button
          className={`mr-7 text-sm ${
            !isPractice
              ? "font-semibold text-gray-700 border-b border-b-2 border-black"
              : "font-normal text-gray-300"
          } `}
          onClick={() => {
            setIsPractice(false);
          }}
        >
          Lessons
        </button>
        <button
          className={`text-sm ${
            isPractice ? "font-semibold text-gray-700 border-b border-b-2 border-black" : "font-normal text-gray-400"
          } `}
          onClick={() => {
            setIsPractice(true);
          }}
        >
          Practice Lessons
        </button>
      </div>
      <div className="flex justify-between items-center py-4 px-6 text-sm font-normal">
        {headings.map((heading) => {
          return (
            <div key={heading} className="w-[25%]">
              <p>{heading}</p>
            </div>
          );
        })}
      </div>
      <div className="h-[70vh] overflow-y-scroll rounded-[20px]">
        {lessonAnalyticsArray
          .filter((lesson: any) => lesson.is_practice_lesson === isPractice)
          .map((lesson: any) => {
            return (
              <div
                onClick={() => {
                  viewRecordings(lesson);
                }}
                key={lesson.id}
                className={`py-4 px-6 border-b border-gray-200 rounded-b-[20px] ${
                  lesson?.type === "avatar" && "cursor-pointer"
                } flex justify-between items-center rounded-md`}
              >
                <div className="flex-1 text-[13px]">
                  <p>{lesson.title?.slice(0, 28)}</p>
                </div>
                <div className="flex-1">
                  <p
                    className={`${
                      textColorBasedOnStatus[lesson.status || "pending"]
                    } text-[13px]`}
                  >
                    {lesson?.status === approvalPending && (
                      <ApprovalPending lesson={lesson} />
                    )}
                    {lesson?.status !== approvalPending &&
                      (StringFormats.capitalizeFirstLetterOfEachWord(
                        lessonStatusText[lesson?.status]
                      ) ||
                        "Incomplete")}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-[13px]">
                    {FormatDate.formatMilliseconds(lesson.duration) ===
                    "0 seconds"
                      ? "Less Than A Second"
                      : FormatDate.formatMilliseconds(lesson.duration) || "-"}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-[13px]">
                    {lesson.completed_at
                      ? FormatDate.getDateAndTimeFromMilliseconds(
                          lesson.completed_at
                        )
                      : "Yet to Start"}
                  </p>
                </div>
                <div className="flex-1">
                  <p
                    onClick={() => {
                      viewRecordings(lesson);
                    }}
                    className={`text-[13px] ${getClassNames(lesson)}`}
                  >
                    {getRecordingsCount(lesson)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UserLessonAnalytics;
