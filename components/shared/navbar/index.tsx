"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Divider from "@/assets/icons/Divider";
import NavTabs from "../nav-tabs";
import { StringFormats } from "@/lib/StringFormats";
import {
  OrganizationProfile,
  OrganizationSwitcher,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import Modal from "../modal";
import {
  currentOrganizationIdAtom,
  currentUserRoleAtom,
  enrollCourseModalAtom,
} from "@/store/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { admin } from "@/lib/constants";
import useSetOrganization from "@/hooks/useSetOrganization";
import EnrollCourseModal from "../enroll-course-modal/enroll-course-modal";
import useEnrollCourseModal from "@/hooks/useEnrollCourseModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { sendInvite } from "@/services/auth.service";
const Navbar = () => {
  const {
    isEnrollCourseModalOpen,
    onEnrollCourseModalOpen,
    onEnrollCourseModalClose,
    setEnrollCourseModalOpen,
  } = useEnrollCourseModal();
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const [invite, setIsInvite] = useState(false);
  const { user } = useUser();
  useSetOrganization();
  const organizationId = useRecoilValue(currentOrganizationIdAtom);
  const [emailAddress, setEmailAddress] = useState("");
  const forbiddenRoutes = ["sign-in", "sign-up"];

  const pathname = usePathname();
  const showNavbar = !forbiddenRoutes.includes(pathname.split("/")[1]);
  const pathMap: {
    "": "Home";
    courses: "Course";
    analytics: "Analytics";
    practice: "Practice",
    settings: "Settings";
    [key: string]: string;
  } = {
    "": "Home",
    courses: "Course",
    practice: "Practice",
    analytics: "Analytics",
    settings: "Settings",
  };
  const handleInvite = () => {
    if (emailAddress === "") return;
    sendInvite({
      emailAddress,
      organizationId,
      inviterUserId: user?.id as string,
      redirectUrl: "https://dashboard-dev.permian.ai/sign-in",
    });
    setIsInvite(false);
  };
  return showNavbar ? (
    <div className="border-b-[1px] border-neutral-200">
      <div className="flex items-center justify-between w-[98%] md:w-[92%] pb-[12px] m-auto pt-6 px-6">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center overflow-hidden">
              <img
                src="/images/permian.webp"
                alt="logo"
                className="w-[32px] h-[32px] hidden md:block rounded-full overflow-hidden"
              />
            </div>
          </Link>
          <nav className=" flex items-center gap-[6px] ml-[-10px]">
            {/* <Link className="text-gray-600 hover:text-gray-900" href="/">
              Dashboard
            </Link> */}
            <div className="hidden md:block">
              <Divider className="hidden h-9 w-9 text-gray-200 sm:ml-3 sm:block" />
            </div>
            <div>
              <div>
                <p className="text-gray-600 hover:text-gray-900 text-sm">
                  {StringFormats.capitalizeFirstLetter(
                    pathMap[pathname.split("/")[1]]
                  ) || "Home"}
                </p>
              </div>
            </div>
          </nav>
        </div>

        <SignedIn>
          <div className="flex items-center gap-[28px] text-gray-600">
            <div className="hidden md:flex items-center gap-[32px]">
              {/* {currentUserRole === admin && (
                <p
                  onClick={onEnrollCourseModalOpen}
                  className="text-sm text-effect cursor-pointer"
                >
                  Enroll User
                </p>
              )} */}
              {currentUserRole === admin && (
                <p
                  onClick={() => setIsInvite(true)}
                  className="text-sm text-effect cursor-pointer"
                >
                  Invite User
                </p>
              )}
              <a
                href="mailto:admin@permian.ai"
                className="text-sm text-effect cursor-pointer"
              >
                Help
              </a>
            </div>
            <div className="flex items-center gap-2">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </SignedIn>
      </div>
      <div className=" w-[90%] m-auto">
        <NavTabs />
      </div>
      <Modal
        className="w-fit justify-center items-center flex"
        isOpen={invite}
        onClose={() => setIsInvite(false)}
      >
        {/* {" "}
        <div className="w-full flex flex-col gap-4 relative">
          <div className="text-lg px-4 pt-4 font-medium text-gray-700">
            Invite a User
          </div>
          <hr></hr>
          <div className="flex  px-4 pb-4 flex-col gap-3">
            <div className="label-container">
              <label className="text-gray-500 text-[13px]">
                {" "}
                To invite a new user, please specify the email{" "}
              </label>
              <Input
                onChange={(e) => setEmailAddress(e.target.value)}
                className="border border-gray-200 w-full p-2 rounded-md"
                type="email"
                placeholder="email"
                value={emailAddress}
              />
            </div>
            <Button onClick={handleInvite}>Invite</Button>
          </div>
          <div
            onClick={() => setIsInvite(false)}
            className="absolute cursor-pointer transition-all duration-300 ease-in top-[15px] hover:bg-slate-200 right-[15px] p-[3px] rounded-full "
          >
            <Icon
              icon="system-uicons:cross"
              style={{ color: "rgb(25,25,25)" }}
            />
          </div>
        </div> */}
        <OrganizationProfile routing="virtual" />
      </Modal>
      {isEnrollCourseModalOpen && <EnrollCourseModal />}
    </div>
  ) : null;
};

export default Navbar;
