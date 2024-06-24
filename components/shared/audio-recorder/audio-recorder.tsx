import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { FileService } from "@/services/file.service";
import { createClient } from "@deepgram/sdk";
import axios from "axios";

const AudioRecorderComp = ({
  talkHandler,
  sessionInfo,
  repeat,
  conversationsRef,
}: {
  talkHandler: any;
  sessionInfo: any;
  repeat: any;
  conversationsRef?: any;
}) => {
  const promptCount = useRef(0);
  const [microphoneState, setMicrophoneState] = useState("mute");
  const [loading, setLoading] = useState(false);
  const microphoneToggle = () => {};
  const recorderControls = useAudioRecorder();
  const addAudioElement = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    console.log(blob.arrayBuffer());
    const buffer = await blob.arrayBuffer();
    console.log(buffer);
    // const audioUrl = await FileService.uploadImage(blob);
    // console.log(audioUrl);
    const formData = new FormData();

    // Append the Blob to the FormData object
    formData.append("file", blob, "audio_recording.wav");
    formData.append("sessionId", sessionInfo.session_id);

    // Send the FormData object using axios
    setLoading(true);
    const result = await axios.post("/api/audio-record", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(result.data.conversation);
    console.log(result.data.transcript);
    if (conversationsRef.current) {
      conversationsRef.current = [
        ...conversationsRef.current,
        { role: "user", content: result.data.transcript },
      ];
    }
    // repeat(sessionInfo.session_id, result.data.text);
    if (promptCount.current === 0) {
      await talkHandler(result.data.transcript, true);
      promptCount.current++;
    } else {
      await talkHandler(result.data.transcript, false);
    }
    setLoading(false);
    setMicrophoneState("mute");

    // const audio = document.createElement("audio");
    // audio.src = url;
    // console.log(url);
    // audio.controls = true;
    // document.body.appendChild(audio);
  };
  const handleSend = () => {
    if (microphoneState === "send") {
      recorderControls.stopRecording();
    } else {
      recorderControls.startRecording();
      setMicrophoneState("send");
    }
  };
  return (
    <div>
      <div className="hidden">
        <AudioRecorder
          classes={{}}
          onRecordingComplete={addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          downloadFileExtension="webm"
          recorderControls={recorderControls}
        />
      </div>
      <div className="bg-gray-400  simple-transition h-[35px] flex justify-center items-center shadow-1 text-white cursor-pointer px-4 py-2 rounded-[20px]">
        <div className="">
          <a href="#" onClick={(e: any) => microphoneToggle()} className={``}>
            {microphoneState === "active" && (
              <div
                onClick={() => setMicrophoneState("send")}
                className="w-5 hover:scale-[1.2] transition-all duration-200 ease-linear items-center text-white justify-center flex shrink-0"
              ></div>
            )}
            {microphoneState === "send" && (
              <div
                onClick={() => handleSend()}
                className="flex gap-2 items-center"
              >
                <div className="wavy-loader" />
                {loading ? <div className="loader"></div> : <div>send</div>}
              </div>
            )}
            <div
              onClick={() => handleSend()}
              className="w-5 flex items-center  justify-center shrink-0"
            >
              {microphoneState === "mute" && (
                <img src="/mic-mute.svg" alt="" className="h-[1.15rem]" />
              )}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorderComp;
