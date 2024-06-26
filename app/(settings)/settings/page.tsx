"use client";
import { OrganizationProfile } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

const Page = () => {
  return (
    <div className="flex flex-col gap-2 h-full w-[100%] mx-auto ">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <div>
          <h1 className=" font-normal text-gray-600 text-2xl">Settings</h1>
        </div>
      </div>
      <hr className="bg-gray-600 w-full" />
      <div className="w-[90%] mx-auto">
        <OrganizationProfile routing="virtual" />
      </div>
    </div>
  );
};

export default Page;
