"use client";
import Modal from "@/components/shared/modal";
import useNoOrganizationModal from "@/hooks/useNoOrganizationModal";
import { currentUserRoleAtom } from "@/store/atoms";
import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Home() {
  const {
    isNoOrganizationModalOpen,
    onNoOrganizationModalClose,
    onNoOrganizationModalOpen,
  } = useNoOrganizationModal();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  useEffect(() => {
    console.log(userMemberships.data, organization, "userMemberships");
    if (
      setActive &&
      userMemberships.data &&
      userMemberships.data.length > 0 &&
      !organization
    ) {
      setActive({ organization: userMemberships.data[0].organization.id });
    }
  }, [userMemberships.data, setActive, organization]);

  useEffect(() => {
    if (
      user &&
      user?.id &&
      userMemberships.data &&
      userMemberships.data.length === 0
    ) {
      user?.getOrganizationMemberships().then((res) => {
        if (res.total_count == 0) {
          onNoOrganizationModalOpen();
          setTimeout(() => {
            signOut();
          }, 4000);
        }
      });
    }
  }, [user, userMemberships.data]);

  useEffect(() => {
    if (userMemberships.data && organization?.id) {
      const currentOrg = organization?.id;
      const currentMembership = userMemberships.data.find(
        (mem) => mem.organization.id === currentOrg
      );
      if (currentMembership) {
        setCurrentUserRole((prevRole) => {
          if (prevRole !== currentMembership.role) {
            return currentMembership.role;
          }
          return prevRole;
        });
      }
    }
  }, [userMemberships.data, organization?.id]);
  console.log(currentUserRole, "currentUserRole");
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center p-24">
      {/* <h1 className="text-[36px] text-gray-700">Under Construction</h1> */}
      <img
        src="https://t4.ftcdn.net/jpg/00/89/02/67/360_F_89026793_eyw5a7WCQE0y1RHsizu41uhj7YStgvAA.jpg"
        className="w-[400px] h-[400px] object-cover"
      />
      <Modal
        className="w-[500px]"
        isOpen={isNoOrganizationModalOpen}
        onClose={() => null}
      >
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-[24px] font-medium text-center text-gray-600">
            Non-Organizational Members Are Not Allowed
          </h1>
          <h1 className="text-[18px] font-medium text-center text-gray-600">
            You Will Be Signed Out
          </h1>
        </div>
      </Modal>
    </main>
  );
}
