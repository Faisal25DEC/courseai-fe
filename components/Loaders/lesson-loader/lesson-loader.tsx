import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LessonLoader = () => {
  return (
    <div className="w-full h-[100vh] flex ">
      <div className="w-[20%] py-10 flex flex-col gap-3 px-4 h-full border-r border-r-gray-200">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full rounded-[6px]" />
        ))}
      </div>
      <div className="flex justify-center w-[80%]">
        <Skeleton className="h-[60vh] w-[60vw] mt-24" />
      </div>
    </div>
  );
};

export default LessonLoader;
