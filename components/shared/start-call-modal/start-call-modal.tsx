import React from "react";
import Modal from "../modal";
import useEndCallModal from "@/hooks/useEndCallModal";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStartCallModal from "@/hooks/useStartCallModal";

const StartCallModal = ({
  handleSubmit,
  handleRetry,
}: {
  handleSubmit: () => void;
  handleRetry: () => void;
}) => {
  const {
    isStartCallModalOpen,
    onStartCallModalOpen,
    onStartCallModalClose,
    setIsStartCallModalOpen,
  } = useStartCallModal();
  return (
    <Modal
      className="max-w-[500px] left-[58%] top-[58%]"
      isOpen={isStartCallModalOpen}
      onClose={onStartCallModalClose}
    >
      <div className="p-[20px] flex gap-4 flex-col">
        <div className="flex gap-2 items-center text-gray-700">
          <InfoIcon />
          <p className="text-[16px] font-medium">
            Clicking Start Call will open your camera.
            Please ensure you are
            ready and have granted camera permissions.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              handleRetry();
              onStartCallModalClose();
            }}
            size="xsm"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              onStartCallModalClose();
            }}
            size="xsm"
            variant="default"
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StartCallModal;
