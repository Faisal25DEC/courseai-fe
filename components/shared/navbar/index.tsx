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
import { currentUserRoleAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";
import { admin } from "@/lib/constants";

// import { Button } from "./ui/button";

// import PopoverHover from "./custom/popover-hover";
// import UpgradeMessage from "./upgrade-message";
// import TooltipComp from "./tooltip-comp";

const Navbar = () => {
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const [invite, setIsInvite] = useState(false);
  // if (isLoaded && !isSignedIn) {
  //   return redirect('/sign-in');
  // }

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
            {/* <Popover>
              <PopoverTrigger>
                <div className="hover:bg-gray-100 md:px-[6px] py-[5px] transition-all duration-300 cursor-pointer ease-in-out rounded-md flex items-center gap-[12px]">
                  <img
                    className="w-[32px] h-[32px] rounded-full"
                    src={user?.imageUrl}
                    alt=""
                  />
                  <p className="font-medium text-sm">{user?.fullName}</p>
                  <ChevronsUpDown className="text-neutral-700 w-4 h-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="center">
                <p className="border-b-[1px] border-gray-100 px-8 cursor-pointer container-effect py-[9px] text-effect text-[12.5px]">
                  My Workspaces
                </p>
                {[1, 2, 3].map((item, idx) => (
                  <div
                    key={idx}
                    className="container-effect text-[14px] px-8 py-[9px] cursor-pointer text-neutral-700 font-medium flex items-center gap-[8px]"
                  >
                    <Initials
                      name="Whatever"
                      width="28px"
                      height="28px"
                      fontSize="10px"
                    />
                    <p className="">Workspace {idx + 1}</p>
                  </div>
                ))}
                <div className="container-effect px-8 py-[9px] cursor-pointer text-neutral-700 font-medium flex items-center gap-[12px]">
                  <Icon
                    className="w-[24px] h-[24px]"
                    icon="icons8:plus"
                    style={{ color: 'rgb(52,52,52)' }}
                  />
                  <p className="text-[15px]">Add A Worksapce</p>
                </div>
              </PopoverContent>
            </Popover> */}
          </nav>
        </div>
        {/* <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </SignInButton>
            <Link href="/sign-in">
              <Button>Register</Button>
            </Link>
          </div>
        </SignedOut> */}
        <SignedIn>
          <div className="flex items-center gap-[28px]">
            <div className="hidden md:flex items-center gap-[32px]">
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
    </div>
  ) : null;
};

export default Navbar;
