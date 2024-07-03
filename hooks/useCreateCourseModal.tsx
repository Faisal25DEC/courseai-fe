import {
  createCourseModalAtom,
} from "@/store/atoms/index";
import { useRecoilState } from "recoil";

const useCreateCourseModal = (isPractice: boolean) => {
  const [createCourseModalOpen, setCreateCourseModalOpen] = useRecoilState(
    createCourseModalAtom
  );

  const onOpen = () => {
    setCreateCourseModalOpen(true);
  };
  const onClose = () => {
    setCreateCourseModalOpen(false);
  };
  return {
    isOpen: createCourseModalOpen,
    onOpen,
    onClose,
    setCreateCourseModalOpen,
  };
};

export default useCreateCourseModal;
