import { getCourse } from "@/services/lesson.service";
import { currentCourseAtom } from "@/store/atoms";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

const useCurrentCourse = ({ id }: { id: string }) => {
  const [currentCourse, setCurrentCourse] = useRecoilState(currentCourseAtom);
  useEffect(() => {
    if (!id) return;
    const fetchCourse = async (id: string) => {
      try {
        const res = await getCourse(id);
        setCurrentCourse(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse(id);
  }, [id]);
  return [currentCourse, setCurrentCourse];
};

export default useCurrentCourse;
