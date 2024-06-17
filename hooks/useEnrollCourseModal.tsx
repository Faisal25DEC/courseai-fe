import { enrollCourseModalAtom } from "@/store/atoms/index";
import React from "react";
import { useRecoilState } from "recoil";

const useEnrollCourseModal = () => {
  const [isEnrollCourseModalOpen, setEnrollCourseModalOpen] = useRecoilState(
    enrollCourseModalAtom
  );
  const onEnrollCourseModalOpen = () => {
    setEnrollCourseModalOpen(true);
  };
  const onEnrollCourseModalClose = () => {
    setEnrollCourseModalOpen(false);
  };
  return {
    isEnrollCourseModalOpen,
    onEnrollCourseModalOpen,
    onEnrollCourseModalClose,
    setEnrollCourseModalOpen,
  };
};

export default useEnrollCourseModal;
