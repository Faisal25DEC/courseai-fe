import React from "react";
import Modal from "../modal";
import useInfoModal from "@/hooks/useInfoModal";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

const InfoModal = ({ handleClick }: { handleClick: () => void }) => {
  const {
    isInfoModalOpen,
    onInfoModalOpen,
    onInfoModalClose,
    setIsInfoModalOpen,
  } = useInfoModal();
  return (
    <Modal
      className="max-w-[500px]"
      isOpen={isInfoModalOpen !== ""}
      onClose={onInfoModalClose}
    >
      <div className="p-[20px] flex gap-4 flex-col">
        <div className="flex gap-2 items-center text-gray-700">
          <InfoIcon />
          <p className="text-[16px] font-medium">{isInfoModalOpen}</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              handleClick();
              onInfoModalClose();
            }}
            size="xsm"
            variant="default"
          >
            Okay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal;
