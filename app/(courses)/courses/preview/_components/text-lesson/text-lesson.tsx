"use client";
import { StringFormats } from "@/lib/StringFormats";
import { updateLessonForUser } from "@/services/lesson.service";
import { activeLessonAtom, courseIdAtom } from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const extractHrefFromContent = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const anchor = doc.querySelector("a");
  return anchor ? anchor.getAttribute("href") : null;
};

const TextLesson = ({ lesson, lesson_id }: { lesson: any; lesson_id: any }) => {
  const { user } = useUser();
  const currentCourseId = useRecoilValue(courseIdAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const currenTimeRef = React.useRef<number>(0);
  const [hrefValue, setHrefValue] = useState<string | null>(null);

  useEffect(() => {
    if (lesson?.content?.text) {
      const href = extractHrefFromContent(lesson.content.text);
      setHrefValue(href);
    }
  }, [lesson]);

  return (
    <div className="py-4 h-full flex flex-col items-center overflow-auto relative">
      <div className="w-full flex flex-col gap-3 justify-center relative">
        <div className="flex gap-2 items-center justify-between">
          <h1 className="h1-medium self-start pl-12">
            {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
          </h1>
        </div>
        <div className="flex flex-col gap-2 pl-[50px]">
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
          initialContent={lesson?.content?.text}
        />
      </div>
    </div>
  );
};

export default TextLesson;
