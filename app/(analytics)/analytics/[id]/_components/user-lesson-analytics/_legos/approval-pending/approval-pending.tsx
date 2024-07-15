import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { textColorBasedOnStatus } from "../../constants";
import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import {
  lessonStatuses,
  lessonStatusText,
} from "@/lib/constants";
import {
  courseIdAtom,
  currentUserLessonAnalyticsAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  approveLessonRequest,
  getUserAnalytics,
  updateLessonForUser,
} from "@/services/lesson.service";
import { toast } from "sonner";
import { StringFormats } from "@/lib/StringFormats";
const ApprovalPending = ({ lesson }: { lesson: any }) => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [isOpen, setIsOpen] = useState(false);
  const [currentUserLessonAnalytics, setCurrentUserLessonAnalytics] =
    useRecoilState(currentUserLessonAnalyticsAtom);
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);
  const markComplete = (status: string) => {
    setIsOpen(false);
    const dataObj: any = {
      status: status,
    };
    if (status === "approved") {
      dataObj["completed_at"] = Date.now();
    }
    updateLessonForUser({
      user_id: currentUserLessonAnalytics?.user_id,
      course_id: currentCourseId,
      lesson_id: lesson.id,
      data: dataObj,
    })
      .then(() => {
        approveLessonRequest({
          course_id: currentCourseId,
          user_id: currentUserLessonAnalytics?.user_id as string,
          status: status,
        }).then(() => {
          const message =
            status === "pending" ? "Request Rejected" : "Request Approved";
          toast.success(message);
          getUserAnalytics(
            currentUserLessonAnalytics?.user_id as string,
            currentCourseId
          ).then((res) => {
            setCurrentUserLessonAnalytics({
              ...currentUserLessonAnalytics,
              ...res,
            });
          });
        });
      })
      .catch((err) => {
        toast.error("Failed to send request for approval");
      });
  };
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-wrap items-center gap-1 outline-none">
        <p className={`${textColorBasedOnStatus[lesson.status || "pending"]}`}>
          {StringFormats.capitalizeFirstLetterOfEachWord(
            lessonStatusText[lesson.status]
          ) || "Incomplete"}
        </p>
        {/* <Icon icon="ion:chevron-down" className="w-4 h-4" /> */}
      </div>
      {/* <CustomPopover
        className={"w-fit p-2 min-w-[100px] overflow-hidden"}
        align="end"
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={
          <div className="flex flex-wrap items-center gap-1 outline-none">
            <p
              className={`${
                textColorBasedOnStatus[lesson.status || "pending"]
              }`}
            >
              {StringFormats.capitalizeFirstLetterOfEachWord(
                lessonStatusText[lesson.status]
              ) || "Incomplete"}
            </p>
            <Icon icon="ion:chevron-down" className="w-4 h-4" />
          </div>
        }
      >
        <div className="flex flex-col min-w-[100px] text-[13px] transition-all duration-200 ease-linear">
          <div
            onClick={() => markComplete(lessonStatuses.approved)}
            className="flex items-center gap-2 p-[6px] rounded-[6px] cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-linear"
          >
            <p className={`${textColorBasedOnStatus["approved"]}`}>Approve</p>
          </div>
          <div
            onClick={() => markComplete(lessonStatuses.rejected)}
            className="flex items-center gap-2 p-[6px] rounded-[6px] cursor-pointer text-red-500 transition-all duration-200 ease-linear hover:bg-red-500 hover:text-gray-100"
          >
            <p className={``}>Reject</p>
          </div>
        </div>
      </CustomPopover> */}
    </div>
  );
};

export default ApprovalPending;
