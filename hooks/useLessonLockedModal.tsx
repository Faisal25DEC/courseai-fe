import { lessonLockedModalAtom } from "@/store/atoms/index";
import React from "react";
import { useRecoilState } from "recoil";

const useLessonLockedModal = () => {
  const [isLessonLockedModalOpen, setLessonLockedModalOpen] = useRecoilState(
    lessonLockedModalAtom
  );
  const onLessonLockedModalOpen = () => {
    setLessonLockedModalOpen(true);
  };
  const onLessonLockedModalClose = () => {
    setLessonLockedModalOpen(false);
  };
  return {
    isLessonLockedModalOpen,
    onLessonLockedModalOpen,
    onLessonLockedModalClose,
    setLessonLockedModalOpen,
  };
};

export default useLessonLockedModal;
