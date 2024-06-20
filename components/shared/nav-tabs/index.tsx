"use client";

import { admin, currentCourseId } from "@/lib/constants";
import { currentUserRoleAtom } from "@/store/atoms";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecoilState } from "recoil";

export default function NavTabs() {
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const pathname = usePathname();

  const tabs = [
    {
      name: "Course",
      href:
        currentUserRole === admin
          ? "/courses/create"
          : `/courses/${currentCourseId}`,
      hidden: false,
    },
    {
      name: "Analytics",
      href: "/analytics",
      hidden: currentUserRole !== admin,
    },
  ];

  return (
    <div className="hide-scrollbar mb-[-3px] flex h-12 items-center justify-start space-x-2 overflow-x-auto">
      {tabs.map(({ name, href, hidden }) => (
        <Link
          key={href}
          href={href}
          className="relative"
          style={{ display: hidden ? "none" : "block" }}
        >
          <div className="m-1 flex items-center gap-[8px] rounded-md px-3 py-2 relative transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
            <p className="text-sm text-gray-600 hover:text-black">{name}</p>
          </div>
          {(pathname === href ||
            (href.endsWith("/settings") && pathname?.startsWith(href))) && (
            <motion.div
              layoutId="indicator"
              transition={{
                duration: 0.1,
              }}
              className="absolute bottom-0 w-full px-1.5"
            >
              <div className="h-0.5 bg-black" />
            </motion.div>
          )}
        </Link>
      ))}
    </div>
  );
}
