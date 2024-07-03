import { admin } from "@/lib/constants";
import { courseIdAtom, currentUserRoleAtom } from "@/store/atoms";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

function CourseCard({ course }: { course: { id: string; title: string } }) {
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
      <div className="relative flex justify-center md:justify-start">
        <div className={`flex mask-image relative zoom-transition my-2 md:my-4`}>
          <div
            className="mask-image-content text-gray-300 absolute"
            onClick={handleCourseClick}
          >
            <div className="flex flex-col justify-between h-full relative">
              <p className="text-white absolute left-4 right-8 top-4 z-20 bg-transparent outline-none capitalize focus:none">
                {course.title}
              </p>
              <p
                className="absolute z-10 right-5 top-3 font-bold text-white text-[15px] cursor-pointer"
                onClick={handleDotsClick}
              >
                ...
              </p>
            </div>
          </div>
        </div>

        {videoOption && (
          <div
            ref={videoOptionRef}
            className="transition-all duration-200 ease-in w-[140px] p-1 shadow-lg absolute z-20 bg-white rounded-[15px] top-14 left-[60%] md:left-40"
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
    </>
  );
}

export default CourseCard;
