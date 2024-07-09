"use client";

import { UserButton } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { courseIdAtom, currentUserRoleAtom } from "@/store/atoms";
import { admin } from "@/lib/constants";
import Link from "next/link";
import useSetOrganization from "@/hooks/useSetOrganization";
import { Spacer } from "@nextui-org/react";

const Sidebar = () => {
  useSetOrganization();
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [selectedKey, setSelectedKey] = useState("courses");

  useEffect(() => {
    const storedKey = localStorage.getItem("selectedSidebarKey");
    if (storedKey) {
      setSelectedKey(storedKey);
    }

    return () => {
      localStorage.setItem("selectedSidebarKey", "courses");
    };
  }, []);

  const handleNavigation = (key: any) => {
    setSelectedKey(key);
    localStorage.setItem("selectedSidebarKey", key);
  };

  return (
    <div className="h-dvh bg-[#F3F3F3] z-40">
      <div className="relative flex h-full w-72 flex-1 flex-col border-r-small border-divider p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="navbar__logo flex items-center overflow-hidden">
              <img
                src="/images/permian.webp"
                alt="logo"
                className="w-[42px] h-[42px] hidden md:block rounded-full overflow-hidden"
              />
              <p className="flex h-full items-center text-lg ml-1">Permian</p>
            </div>
          </div>
          <div className="flex items-center justify-end pr-1">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        <Spacer y={8} />
        <ul className="text-md font-bold">
          <>
            <Link
              href={
                currentUserRole === admin ? "/courses/list" : `/courses/list`
              }
              legacyBehavior
            >
              <li
                className={`${
                  selectedKey === "courses" ? "bg-gray-800 text-white" : ""
                } ${
                  selectedKey === "courses" ? "" : "hover:bg-gray-200"
                } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
                onClick={() => handleNavigation("courses")}
              >
                <Icon icon="hugeicons:course" className="w-5 h-5" />

                <a className="">Courses</a>
              </li>
            </Link>
          </>
          <>
            <Link
              href={
                currentUserRole === admin
                  ? "/practice/create"
                  : `/practice/create`
              }
              legacyBehavior
            >
              <li
                className={`${
                  selectedKey === "practice" ? "bg-gray-800 text-white" : ""
                } ${
                  selectedKey === "practice" ? "" : "hover:bg-gray-200"
                } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
                onClick={() => handleNavigation("practice")}
              >
                <Icon icon="hugeicons:bot" className="w-5 h-5" />

                <a>Practice</a>
              </li>
            </Link>
          </>
          <>
            <Link
              href={
                currentUserRole === admin
                  ? "/analytics"
                  : `/analytics/${currentCourseId}`
              }
              legacyBehavior
            >
              <li
                className={`${
                  selectedKey === "analytics" ? "bg-gray-800 text-white" : ""
                } ${
                  selectedKey === "analytics" ? "" : "hover:bg-gray-200"
                } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
                onClick={() => handleNavigation("analytics")}
              >
                <Icon icon="solar:chart-outline" className="w-5 h-5" />

                <a>Analytics</a>
              </li>
            </Link>
          </>
          <>
            {currentUserRole === admin && (
              <Link
                href={currentUserRole === admin ? "/settings" : "/settings"}
                legacyBehavior
              >
                <li
                  className={`${
                    selectedKey === "settings" ? "bg-gray-800 text-white" : ""
                  } ${
                    selectedKey === "settings" ? "" : "hover:bg-gray-200"
                  } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
                  onClick={() => handleNavigation("settings")}
                >
                  <Icon icon="solar:settings-outline" className="w-5 h-5" />

                  <a>Settings</a>
                </li>
              </Link>
            )}
          </>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
