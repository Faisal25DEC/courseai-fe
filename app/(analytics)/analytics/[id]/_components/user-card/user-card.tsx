import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import PopoverHover from "@/components/shared/popover-hover/popover-hover";
import { Progress } from "@/components/ui/progress";
import useCurrentUserAnalyticsModal from "@/hooks/useCurrentUserAnalyticsModal";
import useDisclosure from "@/hooks/useDisclosure";
import useFetchLessons from "@/hooks/useFetchLesson";
import { lessonStatuses } from "@/lib/constants";
import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import { expelUser, getUserAnalytics } from "@/services/lesson.service";
import {
  courseIdAtom,
  currentUserLessonAnalyticsAtom,
  globalEnrolledUsersAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Icon } from "@iconify/react";
import { getCourseProgress } from "../../../utils";

const UserCard = ({
  user,
  fetchEnrolledUsers,
}: {
  user: any;
  fetchEnrolledUsers?: any;
}) => {
  const currentCourseId = useRecoilValue(courseIdAtom);
  const [enrolledUsers, setEnrolledUsers] = useRecoilState(
    globalEnrolledUsersAtom
  );
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
    setIsOpen: setIsPopoverOpen,
  } = useDisclosure();
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
      const res = await getUserAnalytics(user?.id, currentCourseId);
      setUserAnalytics(res);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!user) return;
    fetchUserAnalytics();
  }, [currentUserLessonAnalytics, user]);
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

  if (userAnalytics) {
    value = getCourseProgress(userAnalytics, lessonsArray);
  }

  const pendingApprovals = checkForPendingApproval(userAnalytics, lessonsArray);
  const handleExpelUser = async () => {
    try {
      await expelUser(currentCourseId, user?.id);
      await fetchEnrolledUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const popoverContent = [
    {
      label: "View Analytics",
      icon: <Icon icon="fluent-mdl2:view" />,
      onClick: () => {
        setCurrentUserLessonAnalytics({ ...user, ...userAnalytics });
        onCurrentUserAnalyticsModalOpen();
      },
    },
    // {
    //   label: "Expel User",
    //   icon: <Icon icon="iwwa:delete" />,
    //   onClick: () => {
    //     handleExpelUser();
    //   },
    // },
  ];

  return (
    <div
      onClick={() => onUserCardClick(user)}
      key={user?.id}
      className="p-4 shadow-1 cursor-pointer flex justify-between items-center rounded-md"
    >
      <div className="w-[25%] flex items-center gap-2">
        <div className="relative">
          <img
            src={user?.imageUrl}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          {/* {pendingApprovals > 0 && (
            <PopoverHover
              className={""}
              trigger={<div className="">{pendingApprovals}</div>}
              triggerClassName={
                "absolute top-[-4px] right-[-4px] w-4 h-4 rounded-full bg-red-500 text-white text-[10px] "
              }
              value={"Approval Request Pending"}
            />
          )} */}
        </div>
        <div className="text-gray-700 font-medium">
          {user?.firstName} {user?.lastName}
        </div>
      </div>
      <div className="w-[25%]">
        <p className="text-[12px]">{user?.emailAddresses?.[0].emailAddress}</p>
      </div>
      <div className="w-[25%]">
        <p className="text-[12px]">
          {FormatDate.getDateInDDMMYYYY(user?.enrolled_at)}
        </p>
      </div>
      {/* <div className="w-[25%] flex gap-2 items-center">
        <Progress
          className="w-[200px] h-2 border border-gray-100"
          value={value}
        />
        <p className="text-[10.5px]">{value}%</p>
        <div className="mt-1 ml-4">
          <CustomPopover
            className={"w-fit p-0 ml-3 mt-1"}
            align="end"
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            trigger={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  isPopoverOpen ? onPopoverClose() : onPopoverOpen();
                }}
              >
                <Icon
                  className="w-5 text-gray-700 h-5"
                  icon="pepicons-pencil:dots-y"
                />
              </div>
            }
          >
            {popoverContent.map((item, idx) => {
              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                    onPopoverClose();
                  }}
                  className="text-gray-500 hover:text-gray-700  cursor-pointer flex py-[8px] px-[12px] gap-[6px] w-[100%] items-center hover:bg-gray-100 rounded-md transition-all font-medium duration-200 ease-in"
                >
                  <div>{item.icon}</div>
                  <p className="text-[14px] cursor-pointer">{item.label}</p>
                </div>
              );
            })}
          </CustomPopover>
        </div>
      </div> */}
    </div>
  );
};

export default UserCard;
