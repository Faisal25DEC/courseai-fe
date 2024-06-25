import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CreateLessonLoader = () => {
  return (
    <div className="flex flex-col gap-3 py-8 w-full">
      {Array.from({ length: 8 }).map((_, idx) => (
        <Skeleton key={idx} className="h-20 w-full rounded-[20px]" />
      ))}
    </div>
  );
};

export default CreateLessonLoader;
