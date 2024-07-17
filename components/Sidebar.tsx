"use client";

import { UserButton } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  courseIdAtom,
  currentUserRoleAtom,
  selectedSidebarKeyAtom,
} from "@/store/atoms";
import { admin } from "@/lib/constants";
import Link from "next/link";
import useSetOrganization from "@/hooks/useSetOrganization";
import { Spacer } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  useSetOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const currentUserRole = useRecoilValue(currentUserRoleAtom);
  const currentCourseId = useRecoilValue(courseIdAtom);
  const [selectedKey, setSelectedKey] = useRecoilState(selectedSidebarKeyAtom);

  useEffect(() => {
    if (pathname.includes("/courses")) {
      setSelectedKey("courses");
    } else if (pathname.includes("/practice")) {
      setSelectedKey("practice");
    } else if (pathname.includes("/analytics")) {
      setSelectedKey("analytics");
    } else if (pathname.includes("/settings")) {
      setSelectedKey("settings");
    } else if (pathname.includes("/onboarding")) {
      setSelectedKey("onboarding");
    }
  }, [pathname, setSelectedKey]);

  const handleNavigation = (key: string, path: string) => {
    setSelectedKey(key);
    router.push(path);
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
          <li
            className={`${
              selectedKey === "courses" ? "bg-gray-800 text-white" : ""
            } ${
              selectedKey === "courses" ? "" : "hover:bg-gray-200"
            } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
            onClick={() =>
              handleNavigation(
                "courses",
                currentUserRole === admin ? "/courses/list" : `/courses/list`
              )
            }
          >
            <Icon icon="hugeicons:course" className="w-5 h-5" />
            <span>Courses</span>
          </li>
          <li
            className={`${
              selectedKey === "practice" ? "bg-gray-800 text-white" : ""
            } ${
              selectedKey === "practice" ? "" : "hover:bg-gray-200"
            } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
            onClick={() =>
              handleNavigation(
                "practice",
                currentUserRole === admin
                  ? "/practice/create"
                  : `/practice/create`
              )
            }
          >
            <Icon icon="hugeicons:bot" className="w-5 h-5" />
            <span>Practice</span>
          </li>
          <li
            className={`${
              selectedKey === "analytics" ? "bg-gray-800 text-white" : ""
            } ${
              selectedKey === "analytics" ? "" : "hover:bg-gray-200"
            } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
            onClick={() =>
              handleNavigation(
                "analytics",
                currentUserRole === admin
                  ? "/analytics"
                  : `/analytics/${currentCourseId}`
              )
            }
          >
            <Icon icon="solar:chart-outline" className="w-5 h-5" />
            <span>Analytics</span>
          </li>
          {currentUserRole === admin && (
            <li
              className={`${
                selectedKey === "settings" ? "bg-gray-800 text-white" : ""
              } ${
                selectedKey === "settings" ? "" : "hover:bg-gray-200"
              } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
              onClick={() => handleNavigation("settings", "/settings")}
            >
              <Icon icon="solar:settings-outline" className="w-5 h-5" />
              <span>Org Settings</span>
            </li>
          )}
          {currentUserRole === admin && (
            <li
              className={`${
                selectedKey === "onboarding" ? "bg-gray-800 text-white" : ""
              } ${
                selectedKey === "onboarding" ? "" : "hover:bg-gray-200"
              } flex items-center gap-4 p-2 cursor-pointer font-normal text-[14px] rounded-lg mb-2`}
              onClick={() => handleNavigation("onboarding", "/onboarding")}
            >
              <Icon icon="fluent-mdl2:onboarding" className="w-5 h-5" />
              <span>Onboarding</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
