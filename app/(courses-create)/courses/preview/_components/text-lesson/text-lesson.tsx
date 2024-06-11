import dynamic from "next/dynamic";
import React from "react";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
const TextLesson = ({ lesson }: { lesson: any }) => {
  return (
    <div className="py-4 h-full overflow-auto">
      <Editor
        editable={false}
        onChange={() => null}
        initialContent={lesson.text}
      />
    </div>
  );
};

export default TextLesson;
