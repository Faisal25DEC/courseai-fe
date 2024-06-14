import { noOrgnizationModalAtom } from "@/store/atoms/index";
import { useRecoilState } from "recoil";

const useNoOrganizationModal = () => {
  const [isNoOrganizationModalOpen, setNoOrganizationModalOpen] =
    useRecoilState(noOrgnizationModalAtom);
  const onNoOrganizationModalOpen = () => {
    setNoOrganizationModalOpen(true);
  };
  const onNoOrganizationModalClose = () => {
    setNoOrganizationModalOpen(false);
  };
  return {
    isNoOrganizationModalOpen,
    onNoOrganizationModalOpen,
    onNoOrganizationModalClose,
    setNoOrganizationModalOpen,
  };
};

export default useNoOrganizationModal;
