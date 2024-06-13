import { currentUserRoleAtom } from "@/store/atoms";
import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import React, { useEffect } from "react";
import useNoOrganizationModal from "./useNoOrganizationModal";
import { useRecoilState } from "recoil";

const useSetOrganization = () => {
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
};

export default useSetOrganization;
