import { editLessonModalAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";

const useEditLessonModal = () => {
  const [editLessonModalOpen, setEditLessonModalOpen] =
    useRecoilState(editLessonModalAtom);
  const onOpen = () => {
    setEditLessonModalOpen(true);
  };
  const onClose = () => {
    setEditLessonModalOpen(false);
  };
  return {
    isOpen: editLessonModalOpen,
    onOpen,
    onClose,
    setEditLessonModalOpen,
  };
};

export default useEditLessonModal;
