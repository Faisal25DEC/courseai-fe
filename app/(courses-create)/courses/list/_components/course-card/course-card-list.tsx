import { admin } from "@/lib/constants";
import { courseIdAtom, currentUserRoleAtom } from "@/store/atoms";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

function CourseListCard({ course }: { course: { id: string; title: string } }) {
  const router = useRouter();
  const [courseId, setCourseId] = useRecoilState(courseIdAtom);
  const [currentUserRole, setCurrentUserRole] = useRecoilState(currentUserRoleAtom);
  const [videoOption, setVideoOption] = useState(false);
  const videoOptionRef = useRef<HTMLDivElement>(null);

  const handleCourseClick = () => {
    setCourseId(course.id);
    if (currentUserRole === admin) {
      router.push(`/courses/create-lesson/${course.id}`);
    } else {
      router.push(`/courses/${course.id}`);
    }
  };

  const handleDotsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setVideoOption(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (videoOptionRef.current && !videoOptionRef.current.contains(event.target as Node)) {
        setVideoOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [videoOptionRef]);

  return (
    <>
      <div className="relative flex items-center justify-center md:justify-start border-b mx-2 cursor-pointer group transition-transform duration-300 ease-in-out hover:translate-x-2">
      <div className="flex mask-image-list relative zoom-transition my-2 md:my-4">
        <div
          className="mask-image-content text-gray-300 absolute"
          onClick={handleCourseClick}
        ></div>
      </div>

      <div className="flex flex-col justify-between h-full relative">
        <p className="text-[#737373] text-[15px] pl-5 z-20 bg-transparent outline-none capitalize focus:none">
          {course.title}
        </p>
      </div>

      <div>
        <p
          className="absolute z-10 right-5 top-3 font-bold text-[#737373] text-[15px] cursor-pointer"
          onClick={handleDotsClick}
        >
          ...
        </p>
        {videoOption && (
          <div
            ref={videoOptionRef}
            className="transition-all duration-200 ease-in w-[140px] p-1 shadow-lg absolute z-20 bg-white rounded-[15px] top-5 right-10"
          >
            <Listbox aria-label="Actions">
              <ListboxItem
                key="new"
                onClick={() => {
                  setVideoOption(false);
                }}
              >
                Edit Title
              </ListboxItem>
              <ListboxItem
                key="delete"
                color="danger"
                onClick={() => {
                  setVideoOption(false);
                }}
                className="text-danger"
              >
                Delete
              </ListboxItem>
            </Listbox>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CourseListCard;
