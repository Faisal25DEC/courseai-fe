import { Button } from "@/components/ui/button";
import { currentCourseId } from "@/lib/constants";
import {
  enrollUser,
  getEnrolledUsers,
  getEnrolledUsersInACourse,
} from "@/services/lesson.service";
import React from "react";

const OrganizationMemberCard = ({
  member,
  enrolledUsers,
  setEnrolledUsers,
}: {
  member: any;
  enrolledUsers: any;
  setEnrolledUsers: any;
}) => {
  const onMemberCardClick = (member: any) => {
    return null;
  };
  const enrollUserToCourse = (member: any) => {
    enrollUser(currentCourseId, member.userId).then(async () => {
      const enrolledUsersRes = await getEnrolledUsersInACourse(currentCourseId);
      setEnrolledUsers(enrolledUsersRes);
    });
  };
  const checkIfUserIsEnrolled = (member: any) => {
    if (!enrolledUsers) return false;
    return enrolledUsers?.some((user: any) => user?.id === member.userId);
  };
  const isEnrolled = checkIfUserIsEnrolled(member);
  return (
    <div
      onClick={() => onMemberCardClick(member)}
      key={member.userId}
      className="p-3 cursor-pointer flex justify-between items-center rounded-md"
    >
      <div className=" flex items-center gap-2">
        <div className="relative">
          <img
            src={member.imageUrl}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
        </div>
        <div className="text-gray-700 font-medium">
          {member.firstName} {member.lastName}
        </div>
      </div>
      <div>
        {isEnrolled ? (
          <Button className="h-8" variant={"outline"}>
            Enrolled
          </Button>
        ) : (
          <Button
            onClick={() => enrollUserToCourse(member)}
            className="h-8"
            variant={"ghost"}
          >
            Enroll
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrganizationMemberCard;
