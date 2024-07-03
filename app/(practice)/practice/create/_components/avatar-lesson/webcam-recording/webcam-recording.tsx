"use client";
import { baseUrl } from "@/lib/config";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import { v4 as uuidv4 } from "uuid";

const WebcamRecording = ({
  lesson,
  recorderRef,
  mediaElementRef,
  handleStopAndUpload,
}: {
  lesson: any;
  recorderRef: any;
  mediaElementRef: any;
  handleStopAndUpload: any;
}) => {
  const { user } = useUser();
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const audioConstraints = {
    sampleSize: 16,
    channelCount: 2,
  };
  const startRecording = (webCamStream: any) => {
    console.log(recorderRef);
    mediaElementRef.current.srcObject.width = window.screen.width;
    mediaElementRef.current.srcObject.height = window.screen.height;
    mediaElementRef.current.srcObject.fullcanvas = true;

    webCamStream.width = 426;
    webCamStream.height = 240;
    webCamStream.top =
      mediaElementRef.current.srcObject.height - webCamStream.height;
    webCamStream.left =
      mediaElementRef.current.srcObject.width - webCamStream.width;

    recorderRef.current = new RecordRTC(
      [
        mediaElementRef.current.srcObject,
        webCamStream,
      ] as unknown as MediaStream,
      {
        type: "video",
        mimeType: "video/mp4",
      }
    );

    console.log(recorderRef);

    recorderRef.current.startRecording();
  };
  useEffect(() => {
    return () => {
      if (lesson.status === "approved") return;
      console.log(recorderRef);
      handleStopAndUpload();
    };
  }, []);
  return (
    <Webcam
      audio
      muted
      audioConstraints={audioConstraints}
      className="absolute bottom-[1rem] h-[120px] w-[210px] right-2 rounded-[20px] flex items-center justify-center"
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      onUserMedia={startRecording}
    ></Webcam>
  );
};

export default WebcamRecording;
