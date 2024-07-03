import useEnrollCourseModal from "@/hooks/useEnrollCourseModal";
import React, { useEffect, useState } from "react";
import Modal from "../modal";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import {
  courseIdAtom,
  globalEnrolledUsersAtom,
  organizationMembersAtom,
} from "@/store/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import OrganizationMemberCard from "./_legos/organization-member-card/organization-member-card";
import { member } from "@/lib/constants";
import {
  getEnrolledUsers,
  getEnrolledUsersInACourse,
} from "@/services/lesson.service";
import { Icon } from "@iconify/react";
const EnrollCourseModal = () => {
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [organizationMemberships, setOrganizationMemberships] = useRecoilState(
    organizationMembersAtom
  );
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const [enrolledUsers, setEnrolledUsers] = useRecoilState(
    globalEnrolledUsersAtom
  );

  const {
    isEnrollCourseModalOpen,
    onEnrollCourseModalOpen,
    onEnrollCourseModalClose,
    setEnrollCourseModalOpen,
  } = useEnrollCourseModal();

  useEffect(() => {
    if (!organization) return;
    organization?.getMemberships().then(async (res) => {
      const enrolledUsersRes = await getEnrolledUsersInACourse(currentCourseId);
      console.log(enrolledUsersRes, "enrolledUsersRes");
      setEnrolledUsers(enrolledUsersRes);
      const membersArray = res.data;
      const usersArray = membersArray
        .filter((item) => item.role === member)
        .map((member) => member.publicUserData);
      console.log(usersArray, "usersArray");
      setOrganizationMemberships(usersArray);
    });
  }, [organization]);

  return (
    <Modal
      className="max-w-[500px]"
      isOpen={isEnrollCourseModalOpen}
      onClose={onEnrollCourseModalClose}
    >
      <div className="w-full relative">
        <div className="p-4 text-gray-600 font-medium text-[22px]">
          Enroll Users
        </div>
        <hr />
        <div className="flex flex-col gap-2 p-2">
          {organizationMemberships?.map((member: any) => {
            return (
              <OrganizationMemberCard
                member={member}
                key={member.id}
                enrolledUsers={enrolledUsers}
                setEnrolledUsers={setEnrolledUsers}
              />
            );
          })}
        </div>
        <div
          onClick={onEnrollCourseModalClose}
          className="absolute cursor-pointer transition-all duration-300 ease-in top-[15px] hover:bg-slate-200 right-[15px] p-[3px] rounded-full "
        >
          <Icon icon="system-uicons:cross" style={{ color: "rgb(25,25,25)" }} />
        </div>
      </div>
    </Modal>
  );
};

export default EnrollCourseModal;
