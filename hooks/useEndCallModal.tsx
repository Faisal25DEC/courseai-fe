import { endCallModalAtom, infoModalAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";

const useEndCallModal = () => {
  const [isEndCallModalOpen, setIsEndCallModalOpen] =
    useRecoilState(endCallModalAtom);
  const onEndCallModalOpen = () => setIsEndCallModalOpen(true);
  const onEndCallModalClose = () => setIsEndCallModalOpen(false);
  return {
    isEndCallModalOpen,
    onEndCallModalOpen,
    onEndCallModalClose,
    setIsEndCallModalOpen,
  };
};

export default useEndCallModal;
