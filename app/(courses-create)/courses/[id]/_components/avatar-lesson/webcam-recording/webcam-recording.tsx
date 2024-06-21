"use client";
import { baseUrl } from "@/lib/config";
import { currentCourseId } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import { v4 as uuidv4 } from "uuid";

const WebcamRecording = ({
  mediaElementRef,
  conversationsRef,
  lesson,
  lesson_id,
}: {
  mediaElementRef: any;
  conversationsRef: any;
  lesson: any;
  lesson_id: any;
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
  const recorderRef = useRef<any>(null);
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
        mimeType: "video/webm",
      }
    );

    console.log(recorderRef);

    recorderRef.current.startRecording();
  };
  const handleStopAndUpload = async () => {
    if (!recorderRef.current) return;
    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current.getBlob();
      const formData = new FormData();
      const fileName = uuidv4() + ".webm";
      formData.append("file", blob, fileName);
      const conversation = conversationsRef.current || [];
      formData.append("conversation", new Blob([JSON.stringify(conversation)]));

      await axios.post(
        `${baseUrl}/users/${user?.id}/analytics/${currentCourseId}/lessons/${lesson_id}/recordings`,
        formData
      );
    });
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
