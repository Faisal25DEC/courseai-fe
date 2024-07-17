"use client";
import useFetchLessons from "@/hooks/useFetchLesson";
import {
  getCourse,
  getEnrolledUsersInACourseWithAnalytics,
  getUserAnalytics,
} from "@/services/lesson.service";
import { userAnalyticsAtom } from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import UserCard from "./_components/user-card/user-card";
import Modal from "@/components/shared/modal";
import AnalyticsTabs from "./_components/analytics-tabs/analytics-tabs";
import { Icon } from "@iconify/react";
import useCurrentUserAnalyticsModal from "@/hooks/useCurrentUserAnalyticsModal";
const CoordinatorAnalytics = () => {
  const {
    isCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalClose,
    setCurrentUserAnalyticsModalOpen,
  } = useCurrentUserAnalyticsModal();
  const { id } = useParams();
  const [currentUserAnalytics, setCurrentUserAnalytics] = useState({});
  const [lessonsArray, setLessonsArray] = useFetchLessons(id as string);
  const { user } = useUser();
  const [userAnalytics, setUserAnalytics] =
    useRecoilState<any>(userAnalyticsAtom);

  useEffect(() => {
    if (!id) return;
    if (!user && userAnalytics === null) return;
    getEnrolledUsersInACourseWithAnalytics(id as string).then((res) => {
      if (!res) return;
      const currentEnrolledUser = res.find(
        (userRes: any) => userRes.id === user?.id
      );
      setCurrentUserAnalytics(currentEnrolledUser);
    });
  }, [user, id]);
  const headings = ["Name", "Email", "Enrolled At", "Progress"];

  return (
    <div className="flex flex-col gap-4 w-[100%] mx-auto">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <div>
          <h1 className=" font-normal text-gray-600 text-2xl">Analytics</h1>
        </div>
      </div>
      <hr />
      {/* <div className="w-[90%] mx-auto flex items-center gap-4">
    {analyticsCards?.map((item, idx) => {
      return <AnalyticsCard key={idx} card={item} />;
    })}
  </div> */}
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
          {user?.id && <UserCard user={currentUserAnalytics} key={user?.id} />}
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

export default CoordinatorAnalytics;
