import React from "react";
import Modal from "../modal";
import useEndCallModal from "@/hooks/useEndCallModal";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const EndCallModal = ({
  handleSubmit,
  handleRetry,
}: {
  handleSubmit: () => void;
  handleRetry: () => void;
}) => {
  const {
    isEndCallModalOpen,
    onEndCallModalOpen,
    onEndCallModalClose,
    setIsEndCallModalOpen,
  } = useEndCallModal();
  return (
    <Modal
      className="max-w-[500px] left-[58%] top-[58%]"
      isOpen={isEndCallModalOpen}
      onClose={onEndCallModalClose}
    >
      <div className="p-[20px] flex gap-4 flex-col">
        <div className="flex gap-2 items-center text-gray-700">
          <InfoIcon />
          <p className="text-[16px] font-medium">
            Would you like to submit the recording ?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              handleRetry();
              onEndCallModalClose();
            }}
            size="xsm"
            variant="outline"
          >
            Retry
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              onEndCallModalClose();
            }}
            size="xsm"
            variant="default"
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EndCallModal;
