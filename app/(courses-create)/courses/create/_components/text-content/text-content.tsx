"use client";
import { lessonAtom } from "@/store/atoms";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
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
  return (
    <div className="px-8">
      {currentLesson && currentLesson.content ? (
        <RichTextEditor
          initialValue={currentLesson?.content?.text}
          getValue={(content: any) =>
            setCurrentLesson((prev) => {
              return { ...prev, content: { text: content } };
            })
          }
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TextContent;
