import {
  currentAvatarConversationAtom,
  currentUserLessonAnalyticsAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import ApprovalPending from "../user-lesson-analytics/_legos/approval-pending/approval-pending";
import { StringFormats } from "@/lib/StringFormats";
import { lessonStatuses, lessonStatusText } from "@/lib/constants";
import { textColorBasedOnStatus } from "../user-lesson-analytics/constants";
import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import CurrentAvatarConversations from "./_legos/current-avatar-conversations/current-avatar-conversations";

const AvatarConversations = () => {
  const { approvalPending, approved, pending } = lessonStatuses;
  const [currentAvatarConversation, setCurrentAvatarConversation] =
    useRecoilState(currentAvatarConversationAtom);
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
      if (lesson.type !== "avatar") return;
      lessonAnalyticsArrayAns.push({
        ...lesson,
        ...currentUserAnalytics.analytics?.[lesson.id],
      });
    });
    return lessonAnalyticsArrayAns;
  };

  const avatarLessonAnalyticsArray = getUserLessonAnalyticsArray(
    currentUserLessonAnalytics,
    lessonsArray
  );
  console.log(currentAvatarConversation);
  const headings = ["Lesson", "Status", "Time Spent", "Completed At"];
  return (
    <div className="min-h-[90vh] min-w-[990px]">
      {currentAvatarConversation === null && (
        <div className="flex justify-between items-center py-4 px-6 text-sm font-normal">
          {headings.map((heading) => {
            return (
              <div key={heading} className="w-[25%]">
                <p>{heading}</p>
              </div>
            );
          })}
        </div>
      )}
      {currentAvatarConversation === null && (
        <div className="h-[80vh] overflow-y-scroll rounded-[20px]">
          {avatarLessonAnalyticsArray.map((lesson: any) => {
            return (
              <div
                onClick={() => {
                  setCurrentAvatarConversation(lesson?.conversations);
                }}
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
                <div className="w-[25%]">
                  <p className="text-[13px]">
                    {FormatDate.formatMilliseconds(lesson.duration) ===
                    "0 seconds"
                      ? "Less Than A Second"
                      : FormatDate.formatMilliseconds(lesson.duration) || "-"}
                  </p>
                </div>
                <div className="w-[25%]">
                  <p className="text-[13px]">
                    {lesson.completed_at
                      ? FormatDate.getDateAndTimeFromMilliseconds(
                          lesson.completed_at
                        )
                      : "Yet to Start"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {currentAvatarConversation !== null && (
        <CurrentAvatarConversations
          currentAvatarConversations={currentAvatarConversation}
        />
      )}
    </div>
  );
};

export default AvatarConversations;
