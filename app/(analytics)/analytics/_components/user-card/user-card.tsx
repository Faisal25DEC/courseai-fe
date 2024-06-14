import PopoverHover from "@/components/shared/popover-hover/popover-hover";
import { Progress } from "@/components/ui/progress";
import useCurrentUserAnalyticsModal from "@/hooks/useCurrentUserAnalyticsModal";
import useFetchLessons from "@/hooks/useFetchLesson";
import { currentCourseId, lessonStatuses } from "@/lib/constants";
import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import { getUserAnalytics } from "@/services/lesson.service";
import {
  currentUserLessonAnalyticsAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const UserCard = ({ user }: { user: any }) => {
  const [lessonsArray, setLessonsArray] = useRecoilState(lessonsArrayAtom);
  const [currentUserLessonAnalytics, setCurrentUserLessonAnalytics] =
    useRecoilState(currentUserLessonAnalyticsAtom);
  const {
    isCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalClose,
    setCurrentUserAnalyticsModalOpen,
  } = useCurrentUserAnalyticsModal();
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const fetchUserAnalytics = async () => {
    try {
      const res = await getUserAnalytics(user.id, currentCourseId);
      setUserAnalytics(res);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserAnalytics();
  }, [currentUserLessonAnalytics]);
  useEffect(() => {
    document.addEventListener("visibilitychange", fetchUserAnalytics);
    return () => {
      document.removeEventListener("visibilitychange", fetchUserAnalytics);
    };
  }, []);
  const onUserCardClick = (user: any) => {
    setCurrentUserLessonAnalytics({ ...user, ...userAnalytics });
    onCurrentUserAnalyticsModalOpen();
  };
  let value = 0;
  const checkForPendingApproval = (userAnalytics: any, lessonsArray: any) => {
    let pendingApproval = 0;
    lessonsArray.forEach((lesson: any) => {
      if (
        userAnalytics?.analytics[lesson.id]?.status ===
        lessonStatuses.approvalPending
      ) {
        pendingApproval += 1;
      }
    });
    return pendingApproval;
  };
  const getCourseProgress = (userAnalytics: any, lessonsArray: any) => {
    let completedLessons = 0;
    lessonsArray.forEach((lesson: any) => {
      if (userAnalytics?.analytics[lesson.id]?.status === "approved") {
        completedLessons += 1;
      }
    });

    return Math.round((completedLessons / lessonsArray.length) * 100);
  };

  if (userAnalytics) {
    value = getCourseProgress(userAnalytics, lessonsArray);
  }

  const pendingApprovals = checkForPendingApproval(userAnalytics, lessonsArray);

  return (
    <div
      onClick={() => onUserCardClick(user)}
      key={user.id}
      className="p-4 shadow-1 cursor-pointer flex justify-between items-center rounded-md"
    >
      <div className="w-[25%] flex items-center gap-2">
        <div className="relative">
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          {pendingApprovals > 0 && (
            <PopoverHover
              trigger={
                <div className="absolute top-[-4px] text-white text-[10px] right-[-5px] w-4 h-4 rounded-full bg-red-500 flex justify-center items-center">
                  {pendingApprovals}
                </div>
              }
              value={"Approval Request Pending"}
            />
          )}
        </div>
        <div className="text-gray-700 font-medium">
          {user.firstName} {user.lastName}
        </div>
      </div>
      <div className="w-[25%]">
        <p className="text-[12px]">{user.emailAddresses[0].emailAddress}</p>
      </div>
      <div className="w-[25%]">
        <p className="text-[12px]">
          {FormatDate.getDateInDDMMYYYY(user.enrolled_at)}
        </p>
      </div>
      <div className="w-[25%] flex gap-2 items-center">
        <Progress
          className="w-[200px] h-2 border border-gray-100"
          value={value}
        />
        <p className="text-[10.5px]">{value}%</p>
      </div>
    </div>
  );
};

export default UserCard;
