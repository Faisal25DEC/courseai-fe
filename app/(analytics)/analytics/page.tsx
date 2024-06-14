"use client";
import { baseUrl } from "@/lib/config";
import { currentCourseId } from "@/lib/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import UserCard from "./_components/user-card/user-card";
import { getCourse, getCourseAnalytics } from "@/services/lesson.service";
import Modal from "@/components/shared/modal";
import useCurrentUserAnalyticsModal from "@/hooks/useCurrentUserAnalyticsModal";
import useFetchLessons from "@/hooks/useFetchLesson";
import UserLessonAnalytics from "./_components/user-lesson-analytics/user-lesson-analytics";

const Page = () => {
  const [lessonsArray, setLessonsArray] = useFetchLessons(currentCourseId);

  const {
    isCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalClose,
    setCurrentUserAnalyticsModalOpen,
  } = useCurrentUserAnalyticsModal();
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      try {
        const usersRes = await axios.get("/api/get-users-from-clerk");
        const res = await axios.get(
          `${baseUrl}/courses/${currentCourseId}/users`
        );
        const courseAnalyticsRes = await getCourseAnalytics(currentCourseId);
        const users = usersRes.data.data;
        const enrolledUsersIds = res.data;

        const enrolledUsersArray = users.filter((user: any) =>
          enrolledUsersIds.some((item: any) => item.user_id === user.id)
        );
        const enrolledUsersWithDate = enrolledUsersArray.map((user: any) => {
          return {
            ...user,
            enrolled_at: enrolledUsersIds.find(
              (item: any) => item.user_id === user.id
            ).enrolled_at,
          };
        });
        setEnrolledUsers(enrolledUsersWithDate);
      } catch (error) {
        toast.error("Failed to fetch enrolled users");
        console.error(error);
      }
    };

    fetchEnrolledUsers();
  }, []);

  const headings = ["Name", "Email", "Enrolled At", "Progress"];
  return (
    <div className="flex flex-col gap-4 w-[100%] mx-auto">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <div>
          <h1 className=" font-normal text-gray-600 text-2xl">Analytics</h1>
        </div>
      </div>
      <hr />
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
            return <UserCard user={user} key={user?.id} />;
          })}
        </div>
      </div>
      <Modal
        isOpen={isCurrentUserAnalyticsModalOpen}
        onClose={onCurrentUserAnalyticsModalClose}
      >
        <UserLessonAnalytics />
      </Modal>
    </div>
  );
};

export default Page;
