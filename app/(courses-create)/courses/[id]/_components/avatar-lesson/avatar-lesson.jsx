"use client";
import Microphone from "@/components/shared/microphone/microhpone";
import { DeepgramContextProvider } from "@/context/Deepgram";
import { MicrophoneContextProvider } from "@/context/Microphone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useDisclosure from "@/hooks/useDisclosure";
import { useRecoilState } from "recoil";
import { activeLessonAtom } from "@/store/atoms";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import { v4 as uuidv4 } from "uuid";
import { currentCourseId } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { baseUrl } from "@/lib/config";
import { StringFormats } from "@/lib/StringFormats";
import {
  approveLessonRequest,
  getUserAnalytics,
  updateLessonForUser,
} from "@/services/lesson.service";
import useTrackLessonDuration from "@/hooks/useTrackLessonDuration";
import { AudioRecorder } from "react-audio-voice-recorder";

const heygen_API = {
  apiKey: "YWUxN2ZhNmE3N2Y4NGMxYzg1OTc5NjRkMDk2ZTNhNzgtMTcxNTYyODk2MA==",
  serverUrl: "https://api.heygen.com",
};

const apiKey = heygen_API.apiKey;
const SERVER_URL = heygen_API.serverUrl;

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const audioConstraints = {
  sampleSize: 16,
  channelCount: 2,
};

export default function AvatarLesson({
  avatar_id,
  voice_id,
  thumbnail,
  avatar_name,
  lesson_id,
  lesson,
}) {
  const [conversations, setConversations] = useState([]);
  const conversationsRef = useRef([]);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [knowledgeBase, setKnowledgeBase] = useState(""); // [knowledgeBase, setKnowledgeBase
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [aiTalking, setAITalking] = useState(false); // [aiTalking, setAITalking
  const avartarStreamingRef = useRef(false);
  const [aiLoading, setAILoading] = useState(false); // [aiLoading, setAILoading
  const [triggerBeginMessage, setTriggerBeginMessage] = useState(false);
  const [sessionState, setSessionState] = useState(null); // [session_id, peerConnection
  const avatarIDRef = useRef(null);
  const voiceIDRef = useRef(null);
  const taskInputRef = useRef(null);
  const mediaElementRef = useRef(null);
  const canvasElementRef = useRef(null);
  const bgCheckboxRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const currenTimeRef = useRef(Date.now());
  // const [webCamState, setWebCamState] = useState(null);
  // const [blob, setBlob] = useState(null);
  const recorderRef = useRef(null);
  const [isDocumentVisible, setIsDocumentVisible] = useState(false);
  const { user } = useUser();
  useTrackLessonDuration({
    currenTimeRef,
    lesson,
    setIsDocumentVisible,
    isDocumentVisible,
  });
  useEffect(() => {
    if (lesson.status === "rejected") {
      toast.error("Admin has rejected the approval request.");
      toast.dismiss();
    }
    if (apiKey === "YourApiKey" || SERVER_URL === "") {
      alert("Please enter your API key and server URL in the api.json file");
    }
  }, []);
  useEffect(() => {
    currenTimeRef.current = Date.now();

    return () => {
      const duration = Date.now() - currenTimeRef.current;
    };
  }, [activeLesson]);

  async function talkToOpenAI(prompt, newPrompt) {
    const data = await axios.post(`/api/complete`, {
      prompt,
      newPrompt: newPrompt || false,
      sessionId: sessionInfo.session_id,
    });

    if (data.status === 500) {
      console.error("Server error");
      throw new Error("Server error");
    } else {
      taskInputRef.current.value = "";
      conversationsRef.current = data.data.conversation;

      return data.data.text;
    }
  }
  async function repeat(session_id, text) {
    avartarStreamingRef.current = true;
    const response = await fetch(`${SERVER_URL}/v1/streaming.task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({ session_id, text }),
    });
    if (response.status === 500) {
      throw new Error("Server error");
    } else {
      const data = await response.json();
      return data.data;
    }
  }

  async function talkHandler(text) {
    if (!sessionInfo) {
      return;
    }
    const prompt = taskInputRef?.current?.value || text; // Using the same input for simplicity
    if (prompt.trim() === "") {
      alert("Please enter a prompt for the LLM");
      return;
    }

    try {
      if (aiTalking) {
        taskInputRef.current.value = "";
        return;
      }
      setAILoading(true);
      setAITalking(true);
      const text = await talkToOpenAI(prompt);
      const seconds = text.split(" ").length / 2;

      setAILoading(false);

      if (text) {
        // Send the AI's response to Heygen's streaming.task API
        const resp = await repeat(sessionInfo.session_id, text);
      } else {
        console.log("No response from AI");
      }
    } catch (error) {
      console.error("Error talking to AI:", error);
    }
  }

  const createNewSession = async () => {
    const avatar = avatar_id;
    const voice = voice_id;

    try {
      toast.loading("Creating session");

      const response = await fetch(`${SERVER_URL}/v1/streaming.new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          quality: "high",
          avatar_name: avatar_name,
          avatar_id: avatar_name + "",
          voice: {
            voice_id: voice,
            rate: 1.15,
          },
        }),
      });

      if (response.status === 500) throw new Error("Server error");
      const data = await response.json();
      const { sdp, ice_servers2: iceServers } = data.data;

      const pc = new RTCPeerConnection({ iceServers });
      pc.ontrack = (event) => {
        if (event.track.kind === "video") {
          mediaElementRef.current.srcObject = event.streams[0];
        }
      };
      pc.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onmessage = (e) => console.log("Received message:", e.data);
      };

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      toast.success("Session created successfully");
      setPeerConnection(pc);
      setSessionInfo(data.data);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };
  // start the session
  async function startSession(session_id, sdp) {
    toast.loading("Starting session");
    const response = await fetch(`${SERVER_URL}/v1/streaming.start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({ session_id, sdp }),
    });
    toast.dismiss();
    if (response.status === 500) {
      console.error("Server error");

      throw new Error("Server error");
    } else {
      const data = await response.json();

      return data.data;
    }
  }
  async function handleICE(session_id, candidate) {
    const response = await fetch(`${SERVER_URL}/v1/streaming.ice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({ session_id, candidate }),
    });
    if (response.status === 500) {
      console.error("Server error");

      throw new Error("Server error");
    } else {
      const data = await response.json();
      return data;
    }
  }
  const startAndDisplaySession = async () => {
    if (!peerConnection || !sessionInfo) {
      alert("No active session or peer connection.");
      return;
    }
    const localDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(localDescription);

    // When ICE candidate is available, send to the server
    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        handleICE(sessionInfo.session_id, candidate.toJSON());
      }
    };

    // When ICE connection state changes, display the new state
    peerConnection.oniceconnectionstatechange = (event) => {
      console.log(
        "ICE connection state changed:",
        peerConnection.iceConnectionState
      );
    };

    // Start session
    await startSession(sessionInfo.session_id, localDescription);
    setSessionState("connected");
    if (!triggerBeginMessage) {
      setTriggerBeginMessage(true);
    }
  };

  const closeConnectionHandler = async () => {
    if (!peerConnection) {
      alert("No active connection to close.");
      return;
    }
    try {
      peerConnection.close();
      setPeerConnection(null);
      console.log("Connection closed successfully.");
      // Optionally notify the server to close the session
      // await closeServerSession(sessionInfo.session_id);
    } catch (error) {
      console.error("Failed to close the connection:", error);
    }
  };
  useEffect(() => {
    const mediaElement = mediaElementRef.current;
    if (mediaElement) {
      const onLoadedMetadata = () => {
        mediaElement.play();
      };
      mediaElement.addEventListener("loadedmetadata", onLoadedMetadata);
      return () =>
        mediaElement.removeEventListener("loadedmetadata", onLoadedMetadata);
    }
  }, []);
  useEffect(() => {
    if (peerConnection && sessionInfo) {
      startAndDisplaySession();
    }
  }, [peerConnection, sessionInfo]);

  const handleStopAndUpload = async () => {
    if (!recorderRef.current) return;
    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current.getBlob();
      const formData = new FormData();
      const fileName = uuidv4() + ".webm";
      formData.append("file", blob, fileName);
      const conversation = conversationsRef.current || [];
      formData.append("conversation", new Blob([JSON.stringify(conversation)]));

      await fetch(
        `${baseUrl}/users/${user?.id}/analytics/${currentCourseId}/lessons/${lesson_id}/recordings`,
        {
          method: "POST",
          body: formData,
          "Content-Type": "multipart/form-data",
        }
      );
    });
  };

  useEffect(() => {
    return () => {
      if (lesson.status === "approved") return;
      handleStopAndUpload();
    };
  }, []);

  const startRecording = (webCamStream) => {
    mediaElementRef.current.srcObject.width = window.screen.width;
    mediaElementRef.current.srcObject.height = window.screen.height;
    mediaElementRef.current.srcObject.fullcanvas = true;

    webCamStream.width = 320;
    webCamStream.height = 240;
    webCamStream.top =
      mediaElementRef.current.srcObject.height - webCamStream.height;
    webCamStream.left =
      mediaElementRef.current.srcObject.width - webCamStream.width;

    recorderRef.current = new RecordRTC(
      [mediaElementRef.current.srcObject, webCamStream],
      {
        type: "video",
        mimeType: "video/webm",
      }
    );

    recorderRef.current.startRecording();
  };
  const markComplete = () => {
    if (lesson.submission === "automatic") {
      updateLessonForUser({
        user_id: user?.id,
        course_id: currentCourseId,
        lesson_id: lesson.id,
        data: {
          status: "approved",
          duration: Date.now() - currenTimeRef.current,
          completed_at: Date.now(),
        },
      })
        .then(() => {
          getUserAnalytics(user?.id, currentCourseId).then((res) => {
            setUserAnalytics(res?.analytics);
          });
        })
        .catch((err) => {
          toast.error("Failed to mark lesson as complete");
        });
    } else {
      updateLessonForUser({
        user_id: user?.id,
        course_id: currentCourseId,
        lesson_id: lesson.id,
        data: {
          status: "approval-pending",
          duration: Date.now() - currenTimeRef.current,
        },
      })
        .then(() => {
          approveLessonRequest({
            lesson_id: lesson.id,
            course_id: currentCourseId,
            user_id: user?.id,
            status: "pending",
          }).then(() => {
            toast.success("Request sent for approval");
            getUserAnalytics(user?.id, currentCourseId).then((res) => {
              setUserAnalytics(res?.analytics);
            });
          });
        })
        .catch((err) => {
          toast.error("Failed to send request for approval");
        });
    }
  };
  return (
    <div className="w-full relative">
      <div className="h-[90vh] w-full flex  flex-col">
        <div className="w-full flex flex-col gap-3 mt-3 relative justify-center items-center">
          {(!peerConnection ||
            !sessionInfo ||
            sessionState !== "connected") && (
            <div className="flex justify-center items-center h-full  w-[900px]">
              <div className="flex self-start gap-2 py-2 items-center justify-between pl-2">
                <h1 className="h1-medium self-start">
                  {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
                </h1>
              </div>
              <div className="flex self-start flex-col gap-2 pb-2 pl-2">
                <p className="text-gray-600 text-[16px]">
                  {lesson?.description}
                </p>
              </div>
              <div className="absolute flex flex-col justify-center items-center h-full gap-[15%]">
                <div className="flex justify-center cursor-pointer items-center gradient-1 p-4 h-24 w-24 rounded-full">
                  <img
                    src={"/images/play.png"}
                    className="w-20 h-20 pl-2 hover:scale-[1.1] transition-all duration-300 ease-in-out"
                    onClick={() => {
                      createNewSession().then(() => {});
                    }}
                  />
                </div>
                {/* <Button onClick={startAndDisplaySession}>Start Session</Button> */}
                {/* <Button onClick={closeConnectionHandler}>Close Session</Button> */}
              </div>

              <img
                src={thumbnail}
                alt="ai-avatar"
                className="object-cover w-[900px] md:rounded-[20px] h-[60vh] shadow-lg"
              />
            </div>
          )}
          <div className="h-fit flex flex-col justify-center gap-3 items-center relative py-8">
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <div className="flex w-full self-start gap-2 items-center justify-between">
                <h1 className="h1-medium self-start">
                  {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
                </h1>
                <div className="self-end top-2 right-2">
                  {lesson.status === "approved" ? (
                    <Button variant={"outline"}>Completed</Button>
                  ) : lesson.status === "approval-pending" ? (
                    <Button>Approval Pending</Button>
                  ) : (
                    <Button onClick={markComplete}>Mark Complete</Button>
                  )}
                </div>
              </div>
            )}
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <div className="flex self-start flex-col gap-2">
                <p className="text-gray-600 text-[16px]">
                  {lesson?.description}
                </p>
              </div>
            )}
            <div className="relative">
              <video
                align="center"
                className="h-[60vh] shadow-lg w-full md:w-auto md:rounded-[20px] object-cover mx-auto self-center"
                ref={mediaElementRef}
                autoPlay
                style={{
                  display: sessionState === "connected" ? "block" : "none",
                }}
              />
              {peerConnection &&
                sessionInfo &&
                sessionState === "connected" && (
                  <Webcam
                    audio
                    muted
                    audioConstraints={audioConstraints}
                    className="absolute bottom-[1rem] h-[120px] w-[210px] right-2 rounded-[20px] flex items-center justify-center"
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMedia={startRecording}
                  ></Webcam>
                )}
              {peerConnection &&
                sessionInfo &&
                sessionState === "connected" && (
                  <div className="flex gap-2 items-end left-[50%] translate-x-[-50%] absolute bottom-[1rem]">
                    <div className="flex flex-col gap-2">
                      {/* <div className="relative">
                        <input
                          placeholder="Write your query and press enter to talk"
                          className="text-gray-100 px-2 glassmorphic-effect-1 placeholder:text-gray-300 placeholder:text-[13px] pb-1 h-9 !outline-none !border-none focus:outline-none focus:border-none w-[200px] md:w-[350px] rounded-[20px] bg-transparent "
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              talkHandler();
                            }
                          }}
                          ref={taskInputRef}
                          type="text"
                        />
                        {aiLoading && (
                    <div className="absolute right-2 text-white absolute-center-top">
                      <Loader
                        width={"20px"}
                        className="mt-[8px] border-neutral-200"
                      />
                    </div>
                  )}
                      </div> */}
                    </div>
                    {/* <Button onClick={() => talkHandler()}>Talk</Button> */}
                    <AudioRecorder talkHandler={talkHandler} />
                    {/* <MicrophoneContextProvider>
                      <DeepgramContextProvider>
                        <Microphone
                          talkHandler={talkHandler}
                          taskInputRef={taskInputRef}
                        />
                      </DeepgramContextProvider>
                    </MicrophoneContextProvider> */}
                  </div>
                )}
            </div>
            <canvas ref={canvasElementRef} style={{ display: "none" }} />{" "}
          </div>
        </div>
        {/* {conversationsRef.current.map((item) => {
          return <div key={item.content}>{item.content}</div>;
        })} */}
      </div>
    </div>
  );
}
