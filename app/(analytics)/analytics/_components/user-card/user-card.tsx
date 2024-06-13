import { Progress } from "@/components/ui/progress";
import { FormatDate } from "@/lib/DateHelpers/DateHelpers";
import React from "react";

const UserCard = ({ user }: { user: any }) => {
  return (
    <div
      key={user.id}
      className="p-4 shadow-1 flex justify-between items-center rounded-md"
    >
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
      <div>
        <p className="text-[12px]">
          {FormatDate.getDateInDDMMYYYY(user.enrolled_at)}
        </p>
      </div>
      <div>
        <Progress className="w-20 h-2 border border-gray-100" value={10} />
      </div>
    </div>
  );
};

export default UserCard;
