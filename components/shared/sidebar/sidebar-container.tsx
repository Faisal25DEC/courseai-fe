"use client";

import React, { useState } from "react";
import { Chip, ScrollShadow, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/shared/sidebar/sidebar";
import {
  SignedIn,
  UserButton,
  useUser,
  OrganizationProfile,
} from "@clerk/nextjs";
import { useRecoilState, useRecoilValue } from "recoil";
import Modal from "../modal";
import EnrollCourseModal from "../enroll-course-modal/enroll-course-modal";
import useEnrollCourseModal from "@/hooks/useEnrollCourseModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendInvite } from "@/services/auth.service";
import {
  currentOrganizationIdAtom,
  currentUserRoleAtom,
  courseIdAtom,
} from "@/store/atoms";
import { usePathname, useRouter } from "next/navigation";
import useSetOrganization from "@/hooks/useSetOrganization";
import { admin } from "@/lib/constants";

const sidebarItems = [
  {
    key: "courses",
    icon: "hugeicons:course",
    title: "Courses",
    hidden: false,
  },
  {
    key: "practice",
    icon: "hugeicons:bot",
    title: "Practice Bots",
    hidden: false,
  },
  {
    key: "analytics",
    icon: "solar:chart-outline",
    title: "Analytics",
    hidden: false,
  },
  {
    key: "invite",
    icon: "iconoir:add-user",
    title: "Invite Users",
    endContent: (
      <Chip size="sm" variant="flat">
        3
      </Chip>
    ),
    hidden: false,
  },
  {
    key: "help",
    icon: "formkit:help",
    title: "Help",
    href: "mailto:admin@permian.ai",
    hidden: false,
  },
  {
    key: "settings",
    icon: "solar:settings-outline",
    title: "Settings",
    hidden: false,
  },
];

export default function SidebarComponent() {
  const { user } = useUser();
  useSetOrganization();
  const organizationId = useRecoilValue(currentOrganizationIdAtom);
  const [emailAddress, setEmailAddress] = useState("");
  const [invite, setIsInvite] = useState(false);
  const {
    isEnrollCourseModalOpen,
    onEnrollCourseModalOpen,
    onEnrollCourseModalClose,
  } = useEnrollCourseModal();
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const currentCourseId = useRecoilValue(courseIdAtom);
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname.split("/")?.[1] || "home";

  const getSidebarHref = (key: any) => {
    switch (key) {
      case "courses":
        return currentUserRole === admin ? "/courses/list" : `/courses/list`;
      case "practice":
        return currentUserRole === admin
          ? "/practice/create"
          : `/practice/${currentCourseId}`;
      case "analytics":
        return currentUserRole === admin
          ? "/analytics"
          : `/analytics/${currentCourseId}`;
      case "settings":
        return currentUserRole === admin ? "/settings" : "";
      case "invite":
        setIsInvite(true);
        return null;
      default:
        return "#";
    }
  };

  return (
    <div className="h-dvh bg-[#F3F3F3] z-40">
      <div className="relative flex h-full w-72 flex-1 flex-col border-r-small border-divider p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <div className="flex items-center overflow-hidden">
              <img
                src="/images/permian.webp"
                alt="logo"
                className="w-[42px] h-[42px] hidden md:block rounded-full overflow-hidden"
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        <Spacer y={8} />

        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey={"courses"}
            iconClassName="group-data-[selected=true]:text-primary-foreground"
            itemClasses={{
              base: "data-[selected=true]:bg-gray-800 data-[selected=true]:text-black",
              title: "group-data-[selected=true]:text-white",
            }}
            items={sidebarItems}
            onSelect={(key) => {
              const href = getSidebarHref(key);
              if (href) {
                router.push(href);
              }
            }}
          />

          <Spacer y={8} />
        </ScrollShadow>
      </div>

      <Modal
        className="w-fit justify-center items-center flex"
        isOpen={invite}
        onClose={() => setIsInvite(false)}
      >
        <OrganizationProfile routing="virtual" />
      </Modal>
      {isEnrollCourseModalOpen && <EnrollCourseModal />}
    </div>
  );
}
