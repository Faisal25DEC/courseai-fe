import useCreateCourseModal from "@/hooks/useCreateCourseModal";
import useFetchLessons from "@/hooks/useFetchLesson";
import { admin } from "@/lib/constants";
import { getUserAnalytics } from "@/services/lesson.service";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { courseIdAtom, currentUserRoleAtom } from "@/store/atoms";

function CourseCard({
  course,
  index,
}: {
  course: { id: string; title: string; lessons: any[] };
  index: number;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [courseId, setCourseId] = useRecoilState(courseIdAtom);
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);
  const [videoOption, setVideoOption] = useState(false);
  const videoOptionRef = useRef<HTMLDivElement>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    getUserAnalytics(user?.id as string, course.id).then((analyticsRes) => {
      if (analyticsRes) {
        setUserAnalytics(analyticsRes);
      } else {
        console.log("No analytics data received.");
      }
    });
    return () => {
      setUserAnalytics(null);
    };
  }, [course]);

  const handleCourseClick = () => {
    setCourseId(course.id);
    if (currentUserRole === admin) {
      router.push(`/courses/create-lesson/${course.id}`);
    } else {
      if (index === 0 || userAnalytics?.course_status === "approved") {
        router.push(`/courses/${course.id}`);
      }
    }
  };

  const handleDotsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setVideoOption(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        videoOptionRef.current &&
        !videoOptionRef.current.contains(event.target as Node)
      ) {
        setVideoOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [videoOptionRef]);

  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateCourseModal(false);

  return (
    <>
      <div
        className={`${
          currentUserRole === admin
            ? ""
            : index === 0 || userAnalytics?.course_status === "approved"
            ? "opacity-1"
            : "opacity-50 "
        } relative flex justify-center md:justify-start`}
      >
        <div
          className={` flex mask-image relative zoom-transition my-2 md:my-4`}
        >
          <div
            className="mask-image-content text-gray-300 absolute p-1 cursor-pointer"
            onClick={handleCourseClick}
            style={{ position: "relative", overflow: "hidden" }}
          >
            <div className="absolute inset-0" style={{}} />
            <div className="flex flex-col justify-between h-full relative z-10">
              <p className="text-md text-white absolute left-4 right-8 top-4 z-20 bg-transparent outline-none capitalize focus:none">
                {course.title}
              </p>
              {currentUserRole === admin && (
                <p
                  className="absolute z-20 right-5 top-4 font-bold text-white text-[15px] cursor-pointer"
                  onClick={handleDotsClick}
                >
                  ...
                </p>
              )}
              <p className="px-2 py-1 rounded-full text-xs bg-white text-black flex items-center text-md absolute bottom-2 left-5 z-20">
                {course.lessons.length} Lessons{" "}
                <Icon icon="basil:book-solid" className="ml-2 w-5 h-5" />
              </p>
              {currentUserRole === admin
                ? null
                : index === 0 ||
                  (userAnalytics?.course_status !== "approved" && (
                    <Icon
                      icon="mingcute:lock-fill"
                      className="w-5 h-5 absolute right-4 top-4"
                    />
                  ))}
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
                  onCreateLessonModalOpen();
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
