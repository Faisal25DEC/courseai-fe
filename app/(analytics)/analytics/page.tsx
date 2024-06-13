"use client";
import { baseUrl } from "@/lib/config";
import { currentCourseId } from "@/lib/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      try {
        const usersRes = await axios.get("/api/get-users-from-clerk");
        const res = await axios.get(
          `${baseUrl}/courses/${currentCourseId}/users`
        );

        const users = usersRes.data.data;
        const enrolledUsersIds = res.data;
        const enrolledUsersArray = users.filter((user: any) =>
          enrolledUsersIds.some((item: any) => item.user_id === user.id)
        );
        setEnrolledUsers(enrolledUsersArray);
      } catch (error) {
        toast.error("Failed to fetch enrolled users");
        console.error(error);
      }
    };

    fetchEnrolledUsers();
  }, []);

  console.log(enrolledUsers, "enrolledUsers");
  return (
    <div className="flex flex-col gap-4 w-[100%] mx-auto">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <div>
          <h1 className=" font-normal text-gray-600 text-2xl">Enrollments</h1>
        </div>
      </div>
      <hr />
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col gap-4">
          {enrolledUsers.map((user: any) => {
            return (
              <div key={user.id}>
                <div className="flex items-center gap-2">
                  <img
                    src={user.imageUrl}
                    alt="avatar"
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="text-gray-700 font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
