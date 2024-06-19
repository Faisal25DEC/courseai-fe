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
} from "@clerk/nextjs";
import { useState } from "react";
import Modal from "../modal";
import { currentUserRoleAtom, enrollCourseModalAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";
import { admin } from "@/lib/constants";
import useSetOrganization from "@/hooks/useSetOrganization";
import EnrollCourseModal from "../enroll-course-modal/enroll-course-modal";
import useEnrollCourseModal from "@/hooks/useEnrollCourseModal";

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
  useSetOrganization();

  const forbiddenRoutes = ["sign-in", "sign-up"];

  const pathname = usePathname();
  const showNavbar = !forbiddenRoutes.includes(pathname.split("/")[1]);

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
              <Link href="/dashboard">
                <p className="text-gray-600 hover:text-gray-900 text-sm">
                  {StringFormats.capitalizeFirstLetter(
                    pathname.split("/")[1]
                  ) || "Home"}
                </p>
              </Link>
            </div>
          </nav>
        </div>

        <SignedIn>
          <div className="flex items-center gap-[28px]">
            <div className="hidden md:flex items-center gap-[32px]">
              {currentUserRole === admin && (
                <p
                  onClick={onEnrollCourseModalOpen}
                  className="text-sm text-effect cursor-pointer"
                >
                  Enroll User
                </p>
              )}
              {currentUserRole === admin && (
                <p
                  onClick={() => setIsInvite(true)}
                  className="text-sm text-effect cursor-pointer"
                >
                  Invite User
                </p>
              )}
              <p className="text-sm text-effect cursor-pointer">Help</p>
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
        <div>
          {" "}
          <OrganizationProfile routing="virtual" />
        </div>
      </Modal>
      {isEnrollCourseModalOpen && <EnrollCourseModal />}
    </div>
  ) : null;
};

export default Navbar;
