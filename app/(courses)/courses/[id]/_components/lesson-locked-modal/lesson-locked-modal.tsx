import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import useLessonLockedModal from "@/hooks/useLessonLockedModal";
import { InfoIcon } from "lucide-react";

const LessonLockedModal = () => {
  const {
    isLessonLockedModalOpen,
    onLessonLockedModalOpen,
    onLessonLockedModalClose,
  } = useLessonLockedModal();
  const getErrorMessage = () => {
    return "This lesson is locked. Please complete the previous lessons to unlock this lesson.";
  };
  const errorMessage = getErrorMessage();
  return (
    <Modal
      className="max-w-[500px]"
      isOpen={isLessonLockedModalOpen}
      onClose={onLessonLockedModalClose}
    >
      <div className="p-[20px] flex gap-4 flex-col">
        <div className="flex gap-2 items-center text-gray-700">
          <InfoIcon />
          <p className="text-[16px] font-medium">{errorMessage}</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onLessonLockedModalClose}
            size="xsm"
            variant="destructive"
          >
            Go Back
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LessonLockedModal;
