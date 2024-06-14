import { getCourse } from "@/services/lesson.service";
import { lessonsArrayAtom } from "@/store/atoms";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

const useFetchLessons = (id: string) => {
  const [lessonsArray, setLessonsArray] = useRecoilState(lessonsArrayAtom);
  useEffect(() => {
    getCourse(id).then((res) => {
      setLessonsArray(res.lessons);
    });
  }, []);
  return [lessonsArray, setLessonsArray] as any;
};

export default useFetchLessons;
