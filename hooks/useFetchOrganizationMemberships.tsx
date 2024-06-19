"use client";
import { member } from "@/lib/constants";
import { organizationMembersAtom } from "@/store/atoms";
import { useOrganization } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

const useFetchOrganizationMemberships = () => {
  const [organizationMemberships, setOrganizationMemberships] = useRecoilState(
    organizationMembersAtom
  );
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  useEffect(() => {
    if (!organization) return;
    organization?.getMemberships().then(async (res) => {
      const membersArray = res.data;
      const usersArray = membersArray
        .filter((item) => item.role === member)
        .map((member) => member.publicUserData);
      setOrganizationMemberships(usersArray);
    });
  }, [organization]);
  return [organizationMemberships, setOrganizationMemberships] as any;
};

export default useFetchOrganizationMemberships;
