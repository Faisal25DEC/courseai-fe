import {
  createLessonModalAtom,
  createPracticeLessonModalAtom,
} from "@/store/atoms/index";
import React from "react";
import { useRecoilState } from "recoil";

const useCreateLessonModal = (isPractice: boolean) => {
  const [createLessonModalOpen, setCreateLessonModalOpen] = useRecoilState(
    createLessonModalAtom
  );

  const [createPracticeModalOpen, setCreatePracticeModalOpen] = useRecoilState(
    createPracticeLessonModalAtom
  );
  const onOpen = () => {
    if (isPractice) {
      setCreatePracticeModalOpen(true);
    } else {
      setCreateLessonModalOpen(true);
    }
  };
  const onClose = () => {
    if (isPractice) {
      setCreatePracticeModalOpen(false);
    } else {
      setCreateLessonModalOpen(false);
    }
  };
  return {
    isOpen: isPractice ? createPracticeModalOpen : createLessonModalOpen,
    onOpen,
    onClose,
    setCreateLessonModalOpen,
  };
};

export default useCreateLessonModal;
