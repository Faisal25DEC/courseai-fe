import React from "react";

const VideoBlock = ({ url }: { url: string }) => {
  return (
    <div className="video-block">
      <video width="100%" controls>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBlock;
