import { activeLessonAtom } from "@/store/atoms";
import MuxPlayer from "@mux/mux-player-react";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

const VideoLesson = ({ video }: { video: any }) => {
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
    <div className="h-full flex justify-center items-center">
      {video?.playback_id && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={video?.playback_id}
          className="!rounded-[20px] mux-player"
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoLesson;
