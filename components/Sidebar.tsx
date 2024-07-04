"use client";

import { UserButton } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Listbox, ListboxItem, Spacer } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { courseIdAtom, currentUserRoleAtom } from "@/store/atoms";
import { admin } from "@/lib/constants";
import { Key } from "@react-types/shared";
import { useRouter } from "next/navigation";
import useSetOrganization from "@/hooks/useSetOrganization";

const Sidebar = () => {
  useSetOrganization();
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useRecoilState(currentUserRoleAtom);
  const currentCourseId = useRecoilValue(courseIdAtom);

  const [selectedKey, setSelectedKey] = useState("courses");

  useEffect(() => {
    const storedKey = localStorage.getItem("selectedSidebarKey");
    if (storedKey) {
      setSelectedKey(storedKey);
    }
  }, []);

  const getSidebarHref = (key:any) => {
    switch (key) {
      case "courses":
        return currentUserRole === admin ? "/courses/list" : `/courses/list`;
      case "practice":
        return currentUserRole === admin
          ? "/practice/create"
          : `/practice/create`;
      case "analytics":
        return currentUserRole === admin
          ? "/analytics"
          : `/analytics/${currentCourseId}`;
      case "settings":
        return currentUserRole === admin ? "/settings" : "/settings";
      default:
        return "#";
    }
  };

  const handleNavigation = (key:any) => {
    const href = getSidebarHref(key);
    setSelectedKey(key);
    localStorage.setItem("selectedSidebarKey", key);
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="h-dvh bg-[#F3F3F3] z-40">
      <div className="relative flex h-full w-72 flex-1 flex-col border-r-small border-divider p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <div className="navbar__logo flex items-center overflow-hidden">
              <img
                src="/images/permian.webp"
                alt="logo"
                className="w-[42px] h-[42px] hidden md:block rounded-full overflow-hidden"
              />
              <p className="flex h-full items-center text-lg ml-1">Permian</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        <Spacer y={8} />
        <div>
          <Listbox
            variant="faded"
            aria-label="Listbox menu with icons"
            className="text-md font-bold"
            itemClasses={{
              base: "text-[20px] gap-4 font-semibold",
            }}
            onAction={(key) => handleNavigation(key)}
          >
            <ListboxItem
              key="courses"
              startContent={<Icon icon="hugeicons:course" />}
              className={selectedKey === "courses" ? "bg-gray-800 text-white" : ""}
            >
              Courses
            </ListboxItem>
            <ListboxItem
              key="practice"
              startContent={<Icon icon="hugeicons:bot" />}
              className={selectedKey === "practice" ? "bg-gray-800 text-white" : ""}
            >
              Practice
            </ListboxItem>
            <ListboxItem
              key="analytics"
              startContent={<Icon icon="solar:chart-outline" />}
              className={selectedKey === "analytics" ? "bg-gray-800 text-white" : ""}
            >
              Analytics
            </ListboxItem>
            <ListboxItem
              key="settings"
              startContent={<Icon icon="solar:settings-outline" />}
              className={selectedKey === "settings" ? "bg-gray-800 text-white" : ""}
            >
              Settings
            </ListboxItem>
          </Listbox>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
