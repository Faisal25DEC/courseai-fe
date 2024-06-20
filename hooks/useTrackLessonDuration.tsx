import { currentCourseId } from "@/lib/constants";
import { updateLessonForUser } from "@/services/lesson.service";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface IProps {
  currenTimeRef: any;
  lesson: any;
  setIsDocumentVisible: any;
  isDocumentVisible: any;
}

const useTrackLessonDuration = ({
  currenTimeRef,
  lesson,
  setIsDocumentVisible,
  isDocumentVisible,
}: IProps) => {
  const { user } = useUser();
  useEffect(() => {
    return () => {
      if (!user) return;
      const duration = Date.now() - currenTimeRef.current;
      if (lesson.status === "approved") return;
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson.id,

        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      }).then(() => {
        currenTimeRef.current = Date.now();
      });
    };
  }, []);
  useEffect(() => {
    if (lesson.status === "rejected") {
      toast.error("Admin has rejected the approval request.");
      toast.dismiss();
    }
  }, [lesson]);

  useEffect(() => {
    setIsDocumentVisible(!document.hidden);
  }, []);

  useEffect(() => {
    if (!isDocumentVisible && user && lesson.status !== "approved") {
      const duration = Date.now() - currenTimeRef.current;
      updateLessonForUser({
        course_id: currentCourseId,
        lesson_id: lesson.id,
        user_id: user?.id as string,
        data: {
          duration: duration,
        },
      }).then(() => {
        currenTimeRef.current = Date.now();
      });
    }
  }, [isDocumentVisible, user, lesson.id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useTrackLessonDuration;
