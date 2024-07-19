import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { FileService } from "@/services/file.service";
import { createClient } from "@deepgram/sdk";
import axios from "axios";
import { SendHorizonalIcon } from "lucide-react";
import { useRecoilState } from "recoil";
import { responseLoadingAtom, userTranscriptLoadingAtom } from "@/store/atoms";
import Timer from "../timer/timer";
import { Icon } from "@iconify/react";
import TooltipComp from "../tooltip-comp/tooltip-comp";
const AudioRecorderComp = ({
  talkHandler,
  sessionInfo,
  repeat,
  conversationsRef,
  promptCount
}: {
  talkHandler: any;
  sessionInfo: any;
  repeat: any;
  conversationsRef?: any;
  promptCount:any
}) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const [responseLoading, setResponseLoading] =
    useRecoilState(responseLoadingAtom);
  const [userTranscriptLoading, setUserTranscriptLoading] = useRecoilState(
    userTranscriptLoadingAtom
  );
  const [microphoneState, setMicrophoneState] = useState("mute");
  const [loading, setLoading] = useState(false);
  const microphoneToggle = () => {};
  const recorderControls = useAudioRecorder();
  const addAudioElement = async (blob: Blob) => {
    console.log(isCanceling);
    if (isCanceling) return;
    // const url = URL.createObjectURL(blob);
    // console.log(blob.arrayBuffer());

    const formData = new FormData();

    // Append the Blob to the FormData object
    formData.append("file", blob, "audio_recording.wav");
    formData.append("sessionId", sessionInfo.current.session_id);

    // Send the FormData object using axios
    setUserTranscriptLoading(1);
    const result = await axios.post("/api/audio-record", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setUserTranscriptLoading(2);
    if (conversationsRef.current && result.data.transcript !== "") {
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

    // const audio = document.createElement("audio");
    // audio.src = url;
    // console.log(url);
    // audio.controls = true;
    // document.getElementById("audio")?.appendChild(audio);
  };
  const handleSend = () => {
    if (microphoneState === "send") {
      recorderControls.stopRecording();
      setMicrophoneState("mute");
    } else {
      recorderControls.startRecording();
      setMicrophoneState("send");
      setIsCanceling(false);
    }
  };
  const toggleMic = () => {
    if (microphoneState === "send") {
      setIsCanceling(true);
      setMicrophoneState("mute");
      recorderControls.stopRecording();

      // recorderControls.stopRecording();
    } else {
      recorderControls.startRecording();
      setMicrophoneState("send");
    }
  };
  return (
    <TooltipComp
      trigger={
        <div className="simple-transition">
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
          <div className="bg-white  simple-transition h-[35px] flex justify-center items-center shadow-1 text-white cursor-pointer px-4 py-2 rounded-[10px]">
            <div className="">
              <a
                href="#"
                onClick={(e: any) => microphoneToggle()}
                className={``}
              >
                {microphoneState === "active" && (
                  <div
                    onClick={() => setMicrophoneState("send")}
                    className="w-5 hover:scale-[1.2] transition-all duration-200 ease-linear items-center text-white justify-center flex shrink-0"
                  ></div>
                )}
                {microphoneState === "send" && (
                  <div className="flex gap-2 items-center">
                    <div>
                      <TooltipComp
                        trigger={
                          <Icon
                            onClick={() => {
                              toggleMic();
                            }}
                            icon="solar:close-circle-linear"
                            className="w-5 h-5 text-gray-700"
                          />
                        }
                        value={"Discard"}
                      />
                    </div>
                    <Timer />
                    {loading ? (
                      <div className="loader"></div>
                    ) : (
                      <div>
                        <TooltipComp
                          trigger={
                            <Icon
                              onClick={handleSend}
                              icon="fluent:chevron-circle-right-48-regular"
                              className="text-gray-700 w-[22px] h-[22px]"
                            />
                          }
                          value={"Send"}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div
                  onClick={() => handleSend()}
                  className="w-5 flex items-center  justify-center shrink-0"
                >
                  {microphoneState === "mute" && (
                    <Icon
                      icon="mingcute:mic-off-line"
                      className="text-gray-700 w-[22px] h-[22px]"
                    />
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
      }
      value={"Click to Speak"}
    />
  );
};

export default AudioRecorderComp;