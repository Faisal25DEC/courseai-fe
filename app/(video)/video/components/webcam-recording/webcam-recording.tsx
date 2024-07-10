"use client";
import { baseUrl } from "@/lib/config";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useRef, memo } from "react";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import { v4 as uuidv4 } from "uuid";

const WebcamRecordingComponent = ({
  lesson,
  recorderRef,
  mediaElementRef,
}: {
  lesson: any;
  recorderRef: any;
  mediaElementRef: any;
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
    console.log('Starting recording');
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

    console.log('Recorder ref:', recorderRef);

    recorderRef.current.startRecording();
  };

  useEffect(() => {
    console.log('WebCamRecording mounted');

    return () => {
      console.log('WebCamRecording unmounted');
      // if (recorderRef.current && lesson.status !== "approved") {
      //   handleStopAndUpload();
      // }
    };
  }, [recorderRef.current]);

  return (
    <Webcam
      audio
      muted
      audioConstraints={audioConstraints}
      className="absolute bottom-[1rem] h-[120px] w-[210px] right-2 rounded-[20px] flex items-center justify-center"
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      onUserMedia={startRecording}
    />
  );
};

const WebcamRecording = memo(WebcamRecordingComponent);

WebcamRecording.displayName = 'WebcamRecording';

export default WebcamRecording;
