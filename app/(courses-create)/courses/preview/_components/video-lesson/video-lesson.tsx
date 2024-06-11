import MuxPlayer from "@mux/mux-player-react";
import React from "react";

const VideoLesson = ({ video }: { video: any }) => {
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
