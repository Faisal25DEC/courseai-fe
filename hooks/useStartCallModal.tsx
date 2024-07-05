import {
  endCallModalAtom,
  infoModalAtom,
  startCallModalAtom,
} from "@/store/atoms";
import { useRecoilState } from "recoil";

const useStartCallModal = () => {
  const [isStartCallModalOpen, setIsStartCallModalOpen] =
    useRecoilState(startCallModalAtom);
  const onStartCallModalOpen = () => setIsStartCallModalOpen(true);
  const onStartCallModalClose = () => setIsStartCallModalOpen(false);
  return {
    isStartCallModalOpen,
    onStartCallModalOpen,
    onStartCallModalClose,
    setIsStartCallModalOpen,
  };
};

export default useStartCallModal;
