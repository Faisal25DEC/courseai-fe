import { infoModalAtom } from "@/store/atoms";
import React from "react";
import { useRecoilState } from "recoil";

const useInfoModal = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useRecoilState(infoModalAtom);
  const onInfoModalOpen = (message: string) => setIsInfoModalOpen(message);
  const onInfoModalClose = () => setIsInfoModalOpen("");
  return {
    isInfoModalOpen,
    onInfoModalOpen,
    onInfoModalClose,
    setIsInfoModalOpen,
  };
};

export default useInfoModal;
