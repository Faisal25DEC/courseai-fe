"use client";
import { baseUrl } from "@/lib/config";
import { currentCourseId } from "@/lib/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import UserCard from "./_components/user-card/user-card";
import {
  getCourse,
  getCourseAnalytics,
  getEnrolledUsersInACourse,
  getEnrolledUsersInACourseWithAnalytics,
} from "@/services/lesson.service";
import Modal from "@/components/shared/modal";
import useCurrentUserAnalyticsModal from "@/hooks/useCurrentUserAnalyticsModal";
import useFetchLessons from "@/hooks/useFetchLesson";
import UserLessonAnalytics from "./_components/user-lesson-analytics/user-lesson-analytics";
import { Icon } from "@iconify/react";
import { useRecoilState } from "recoil";
import {
  globalEnrolledUsersAtom,
  organizationMembersAtom,
} from "@/store/atoms";
import AnalyticsCard from "./_components/analytics-card/analytics-card";
import useFetchOrganizationMemberships from "@/hooks/useFetchOrganizationMemberships";
import useCurrentCourse from "@/hooks/useCurrentCourse";
import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import AnalyticsTabs from "./_components/analytics-tabs/analytics-tabs";
import { getCourseProgress } from "./utils";
const Page = () => {
  const [currentCourse, setCurrentCourse] = useCurrentCourse({
    id: currentCourseId,
  });
  const [lessonsArray, setLessonsArray] = useFetchLessons(currentCourseId);
  const [organizationMemberships, setOrganizationMemberships] =
    useFetchOrganizationMemberships();
  const {
    isCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalClose,
    setCurrentUserAnalyticsModalOpen,
  } = useCurrentUserAnalyticsModal();
  const [enrolledUsers, setEnrolledUsers] = useRecoilState(
    globalEnrolledUsersAtom
  );
  const fetchEnrolledUsers = async () => {
    try {
      const enrolledUsersWithDate =
        await getEnrolledUsersInACourseWithAnalytics(currentCourseId);
      console.log(enrolledUsersWithDate);
      setEnrolledUsers(enrolledUsersWithDate);
    } catch (error) {
      toast.error("Failed to fetch enrolled users");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEnrolledUsers();
  }, []);
  const getAverageCourseProgress = (lessonsArray: any) => {
    if (!enrolledUsers) return 0;
    let totalProgress = 0;
    enrolledUsers.forEach((user: any) => {
      totalProgress += getCourseProgress(user.analytics, lessonsArray);
    });
    return totalProgress / enrolledUsers.length || 0;
  };
  const analyticsCards = [
    {
      title: "Total Users",
      value: organizationMemberships?.length,
      icon: <Icon icon="clarity:users-line" className="icon-medium" />,
    },
    {
      title: "Enrolled Users",
      value: enrolledUsers?.length,
      icon: (
        <Icon
          className="icon-medium"
          icon="material-symbols-light:play-lesson-outline-rounded"
        />
      ),
    },
    {
      title: "Average Course Progress",
      value: getAverageCourseProgress(lessonsArray) + "%",
      icon: (
        <Icon
          className="icon-medium"
          icon="material-symbols-light:play-lesson-outline-rounded"
        />
      ),
    },
    {
      title: "Number of Students Finished",
      value: enrolledUsers?.filter(
        (user: any) => getCourseProgress(user.analytics, lessonsArray) === 100
      ).length,
      icon: <Icon className="icon-medium" icon="clarity:check-line" />,
    },
    // {
    //   title: "Total Lessons",
    //   value: lessonsArray?.length,
    //   icon: <Icon className="icon-medium" icon="f7:book" />,
    // },
    // {
    //   title: "Last Updated At",
    //   value: FormatDate.getDateInDDMMYYYY(currentCourse?.updated_at),
    //   icon: <Icon className="icon-medium" icon="ic:baseline-update" />,
    // },
  ];
  console.log(organizationMemberships, enrolledUsers, lessonsArray);

  const headings = ["Name", "Email", "Enrolled At", "Progress"];
  return (
    <div className="flex flex-col gap-4 w-[100%] mx-auto">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <div>
          <h1 className=" font-normal text-gray-600 text-2xl">Analytics</h1>
        </div>
      </div>
      <hr />
      <div className="w-[90%] mx-auto flex items-center gap-4">
        {analyticsCards?.map((item, idx) => {
          return <AnalyticsCard key={idx} card={item} />;
        })}
      </div>
      <div className="w-[90%] mx-auto">
        <div className="w-full flex items-center p-4">
          {headings.map((heading) => (
            <div
              key={heading}
              className="text-gray-500 text-[13px] w-[25%] font-normal"
            >
              {heading}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {enrolledUsers.map((user: any) => {
            return (
              <UserCard
                user={user}
                key={user?.id}
                fetchEnrolledUsers={fetchEnrolledUsers}
              />
            );
          })}
        </div>
      </div>
      <Modal
        isOpen={isCurrentUserAnalyticsModalOpen}
        onClose={onCurrentUserAnalyticsModalClose}
        className="w-fit"
      >
        <div className="relative w-full">
          <AnalyticsTabs />
          <div
            onClick={onCurrentUserAnalyticsModalClose}
            className="absolute cursor-pointer transition-all duration-300 ease-in top-[8px] hover:bg-slate-200 right-[5px] p-[3px] rounded-full "
          >
            <Icon
              icon="system-uicons:cross"
              style={{ color: "rgb(25,25,25)" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
