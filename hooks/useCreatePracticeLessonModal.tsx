import {createPracticeLessonModalAtom } from "@/store/atoms/index";
import React from "react";
import { useRecoilState } from "recoil";

const useCreatePracticeLessonModal = () => {
  const [createLessonModalOpen, setCreateLessonModalOpen] = useRecoilState(
    createPracticeLessonModalAtom
  );
  const onOpen = () => {
    setCreateLessonModalOpen(true);
  };
  const onClose = () => {
    setCreateLessonModalOpen(false);
  };
  return {
    isOpen: createLessonModalOpen,
    onOpen,
    onClose,
    setCreateLessonModalOpen,
  };
};

export default useCreatePracticeLessonModal;
