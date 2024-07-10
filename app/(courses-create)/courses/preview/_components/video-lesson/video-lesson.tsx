import { StringFormats } from "@/lib/StringFormats";
import { activeLessonAtom } from "@/store/atoms";
import MuxPlayer from "@mux/mux-player-react";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

const VideoLesson = ({ video, lesson }: { video: any; lesson: any }) => {
  const currenTimeRef = useRef<number>(0);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  useEffect(() => {
    currenTimeRef.current = Date.now();

    return () => {
      const duration = Date.now() - currenTimeRef.current;
      console.log("Duration", duration);
    };
  }, [activeLesson]);
  return (
    <div className="h-full flex flex-col w-full gap-6 justify-center mx-auto relative px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] text-gray-700 font-medium px-4 py-2 relative">
          {StringFormats.capitalizeFirstLetterOfEachWord(lesson.title)}
        </h1>
      </div>
      {video?.playback_id && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={video?.playback_id}
          className="!rounded-[20px] w-full self-center"
          autoPlay
        />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="h2-medium">Description</h1>
        <p className="p-light">{lesson?.description}</p>
      </div>
    </div>
  );
};

export default VideoLesson;
