"use client";
import { lessonAtom } from "@/store/atoms";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const TextContent = () => {
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const onChange = (content: string) => {
    setCurrentLesson({ ...currentLesson, content: { text: content } });
  };
  useEffect(() => {
    setCurrentLesson((prev) => ({
      ...prev,
      content: {
        text: "",
      },
    }));
  }, []);
  console.log(currentLesson);
  return (
    <div className="px-8 flex flex-col gap-4">
      <h1 className="text-gray-700 font-medium text-xl">Lesson Content</h1>
      {currentLesson && currentLesson.content ? (
        <Editor onChange={onChange} initialContent={""} editable={true} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TextContent;
