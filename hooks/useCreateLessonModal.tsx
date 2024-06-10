import { createLessonModalAtom } from "@/store/atoms/index";
import React from "react";
import { useRecoilState } from "recoil";

const useCreateLessonModal = () => {
  const [createLessonModalOpen, setCreateLessonModalOpen] = useRecoilState(
    createLessonModalAtom
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

export default useCreateLessonModal;
