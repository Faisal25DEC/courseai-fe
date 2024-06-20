"use client";
import { lessonAtom, lessonModalTypeAtom } from "@/store/atoms";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState } from "recoil";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const TextContent = () => {
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const onChange = (content: string) => {
    setCurrentLesson({ ...currentLesson, content: { text: content } });
  };

  return (
    <div className="px-8 flex flex-col gap-4 h-[60vh] overflow-auto">
      <h1 className="text-gray-700 font-medium text-xl">Lesson Content</h1>
      {currentLesson ? (
        <Editor
          onChange={onChange}
          initialContent={
            lessonModalType?.type === "edit"
              ? lessonModalType.lesson?.content?.text || ""
              : currentLesson.content?.text || ""
          }
          editable={true}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TextContent;
