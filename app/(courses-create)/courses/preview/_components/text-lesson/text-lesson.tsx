import Editor from "@/components/editor";
import React from "react";

const TextLesson = ({ lesson }: { lesson: any }) => {
  return (
    <div>
      <Editor
        editable={false}
        onChange={() => null}
        initialContent={lesson.text}
      />
    </div>
  );
};

export default TextLesson;
