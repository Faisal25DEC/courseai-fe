import { OrganizationProfile } from "@clerk/nextjs";
import React from "react";
import { Icon } from "@iconify/react";

const page = () => {
  return (
    <div className="flex h-full w-[90%] mx-auto justify-center items-center py-8">
      <OrganizationProfile routing="virtual" />
    </div>
  );
};

export default page;
