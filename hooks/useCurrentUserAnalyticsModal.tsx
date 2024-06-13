import { currentUserAnalyticsModalAtom } from "@/store/atoms/index";
import React from "react";
import { useRecoilState } from "recoil";

const useCurrentUserAnalyticsModal = () => {
  const [isCurrentUserAnalyticsModalOpen, setCurrentUserAnalyticsModalOpen] =
    useRecoilState(currentUserAnalyticsModalAtom);
  const onCurrentUserAnalyticsModalOpen = () => {
    setCurrentUserAnalyticsModalOpen(true);
  };
  const onCurrentUserAnalyticsModalClose = () => {
    setCurrentUserAnalyticsModalOpen(false);
  };
  return {
    isCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalOpen,
    onCurrentUserAnalyticsModalClose,
    setCurrentUserAnalyticsModalOpen,
  };
};

export default useCurrentUserAnalyticsModal;
