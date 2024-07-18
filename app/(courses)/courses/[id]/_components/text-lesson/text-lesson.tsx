"use client";
import { Button } from "@/components/ui/button";
import { StringFormats } from "@/lib/StringFormats";
import {
  approveLessonRequest,
  getCourse,
  getUserAnalytics,
  updateLesson,
  updateLessonForUser,
} from "@/services/lesson.service";
import {
  activeLessonAtom,
  courseIdAtom,
  lessonsArrayAtom,
  userAnalyticsAtom,
} from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const extractHrefFromContent = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const anchor = doc.querySelector("a");
  return anchor ? anchor.getAttribute("href") : null;
};

const TextLesson = ({
  content,
  lesson_id,
  lesson,
}: {
  lesson: any;
  lesson_id: any;
  content: any;
}) => {
  const currentCourseId = useRecoilValue(courseIdAtom);
  const [userAnalytics, setUserAnalytics] = useRecoilState<any>(userAnalyticsAtom);
  const { user } = useUser();
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const currenTimeRef = React.useRef<number>(Date.now());
  const [isDocumentVisible, setIsDocumentVisible] = useState(!document.hidden);
  const [hrefValue, setHrefValue] = useState<string | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (content?.text) {
      const href = extractHrefFromContent(content.text);
      setHrefValue(href);
    }
  }, [content]);

  return (
    <div className="py-4 h-full flex flex-col items-center overflow-auto relative">
      <div className="w-full flex flex-col gap-3 relative">
        <div className="flex gap-2 items-center justify-between">
          <h1 className="h1-medium self-start pl-12">
            {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
          </h1>
          <div className="absolute top-2 right-2"></div>
        </div>
        <div className="flex flex-col gap-2 pl-[51px]">
          <p className="text-gray-600 text-[16px]">{lesson?.description}</p>
        </div>
        {hrefValue && (
          <iframe
            src={hrefValue}
            title="PDF Document"
            width="100%"
            height="600px"
            className="mt-4"
          ></iframe>
        )}
        <Editor
          editable={false}
          onChange={() => null}
          initialContent={content.text}
        />
      </div>
    </div>
  );
};

export default TextLesson;
