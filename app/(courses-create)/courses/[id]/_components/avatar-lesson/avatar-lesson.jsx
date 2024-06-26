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
import {
  activeLessonAtom,
  userAnalyticsAtom,
  userTranscriptLoadingAtom,
} from "@/store/atoms";
import Webcam from "react-webcam";
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
import AudioRecorderComp from "@/components/shared/audio-recorder/audio-recorder";
import dynamic from "next/dynamic";
import InfoModal from "@/components/shared/info-modal/info-modal";
import useInfoModal from "@/hooks/useInfoModal";
import AvatarConversationsLive from "@/components/shared/avatar-conversations-live/avatar-conversations-live";
import { Icon } from "@iconify/react";
import useEndCallModal from "@/hooks/useEndCallModal";
import EndCallModal from "@/components/shared/end-call-modal/end-call-modal";
const WebCamRecording = dynamic(
  () => import("./webcam-recording/webcam-recording"),
  { ssr: false }
);
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
  const {
    isEndCallModalOpen,
    onEndCallModalOpen,
    onEndCallModalClose,
    setIsEndCallModalOpen,
  } = useEndCallModal();
  const {
    isInfoModalOpen,
    onInfoModalOpen,
    onInfoModalClose,
    setIsInfoModalOpen,
  } = useInfoModal();
  const [userTranscriptLoading, setUserTranscriptLoading] = useRecoilState(
    userTranscriptLoadingAtom
  );
  const [userAnalytics, setUserAnalytics] = useRecoilState(userAnalyticsAtom);
  const submitButtonRef = useRef(null);
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
  // useEffect(() => {
  //   if (sessionInfo?.session_id) {
  //     talkToOpenAI("Have u understood the instructions?", true);
  //   }
  // }, [sessionInfo, lesson?.content?.prompt]);

  async function talkToOpenAI(prompt, newPrompt) {
    const data = await axios.post(`/api/complete`, {
      prompt,
      newPrompt: newPrompt || false,
      lesson_prompt: newPrompt ? lesson?.content?.prompt : null,
      sessionId: sessionInfo.session_id,
    });

    if (data.status === 500) {
      console.error("Server error");
      throw new Error("Server error");
    } else {
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
    taskInputRef.current.value = "";
    if (response.status === 500) {
      throw new Error("Server error");
    } else {
      const data = await response.json();
      conversationsRef.current = [
        ...conversationsRef.current,
        { role: "assistant", content: text },
      ];
      setUserTranscriptLoading(0);
      return data.data;
    }
  }

  async function talkHandler(text, newPrompt) {
    if (!sessionInfo) {
      return;
    }
    console.log(text);
    const prompt = taskInputRef?.current?.value || text; // Using the same input for simplicity
    if (prompt.trim() === "") {
      toast.error("Please provide a valid input");
      return;
    }
    try {
      console.log("Prompt:", prompt);
      setAILoading(true);
      setAITalking(true);
      const text = await talkToOpenAI(prompt, newPrompt);
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
      toast.error("Error getting response");
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
          quality: "medium",
          avatar_name: avatar_name,
          avatar_id: avatar_name + "",
          voice: {
            voice_id: voice,
            rate: 1,
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
      // mediaElementRef.current.srcObject = null;
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
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }
    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current.getBlob();
      const formData = new FormData();
      const fileName = uuidv4() + ".mp4";
      formData.append("file", blob, fileName);
      const conversation = conversationsRef.current || [];
      formData.append("conversation", new Blob([JSON.stringify(conversation)]));
      try {
        closeConnectionHandler();
        const response = await axios.post(
          `${baseUrl}/users/${user?.id}/analytics/${currentCourseId}/lessons/${lesson_id}/recordings`,
          formData,
          {
            maxContentLength: Infinity,
          }
        );
        toast.success("Recording submitted successfully");
      } catch (error) {
        toast.error("Failed to submit recording");
      }
    });
  };
  const markComplete = () => {
    if (lesson?.status === "approved") return;
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
  const handleEnd = () => {
    onEndCallModalOpen();
  };
  return (
    <div className="w-full relative">
      <div className="h-[90vh] w-full flex  flex-col">
        <div className="w-full flex flex-col gap-3 mt-3 relative justify-center items-center">
          {(!peerConnection ||
            !sessionInfo ||
            sessionState !== "connected") && (
            <div className="flex justify-center flex-col items-center h-full  w-[1200px]">
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
                    style={{
                      display: isInfoModalOpen !== "" ? "none" : "block",
                    }}
                    className="w-20 h-20 pl-2 hover:scale-[1.1] transition-all duration-300 ease-in-out"
                    onClick={() => {
                      onInfoModalOpen("Video will be recorded");
                    }}
                  />
                </div>
                {/* <Button onClick={startAndDisplaySession}>Start Session</Button> */}
                {/* <Button onClick={closeConnectionHandler}>Close Session</Button> */}
              </div>

              <img
                src={thumbnail}
                alt="ai-avatar"
                className="object-cover w-[1200px] md:rounded-[20px] h-[70vh] shadow-lg"
              />
            </div>
          )}
          <div className="h-fit flex flex-col justify-center gap-3 items-center relative py-8">
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <div className="flex w-full self-start gap-2 items-center justify-between">
                <h1 className="h1-medium self-start">
                  {StringFormats.capitalizeFirstLetterOfEachWord(lesson?.title)}
                </h1>

                {/* <div className="self-end flex items-center gap-2">
                  <Button
                    ref={submitButtonRef}
                    onClick={() => {
                      handleStopAndUpload();
                    }}
                    className=""
                    variant={"outline"}
                  >
                    Submit Recording
                  </Button>
                  {lesson.status === "approved" ? (
                    <Button variant={"outline"}>Completed</Button>
                  ) : lesson.status === "approval-pending" ? (
                    <Button>Approval Pending</Button>
                  ) : (
                    <Button onClick={markComplete}>Mark Complete</Button>
                  )}
                </div> */}
              </div>
            )}
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <div className="flex self-start flex-col gap-2">
                <p className="text-gray-600 text-[16px]">
                  {lesson?.description}
                </p>
              </div>
            )}
            <div className="flex">
              <div className="relative">
                <video
                  align="center"
                  className="h-[70vh] shadow-lg w-full md:w-auto md:rounded-l-[20px] object-cover mx-auto self-center"
                  ref={mediaElementRef}
                  autoPlay
                  style={{
                    display:
                      sessionState === "connected" && peerConnection
                        ? "block"
                        : "none",
                  }}
                />

                {peerConnection &&
                  sessionInfo &&
                  sessionState === "connected" && (
                    <WebCamRecording
                      lesson={lesson}
                      recorderRef={recorderRef}
                      mediaElementRef={mediaElementRef}
                      handleStopAndUpload={handleStopAndUpload}
                    />
                  )}
                {peerConnection &&
                  sessionInfo &&
                  sessionState === "connected" && (
                    <div className="flex gap-2 items-end left-[50%] translate-x-[-50%] absolute bottom-[1rem]">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <input
                            placeholder="Write hidden your query and press enter to talk"
                            className="text-gray-100 hidden px-2 glassmorphic-effect-1 placeholder:text-gray-300 placeholder:text-[13px] pb-1 h-9 !outline-none !border-none focus:outline-none focus:border-none w-[200px] md:w-[350px] rounded-[20px] bg-transparent "
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                talkHandler();
                              }
                            }}
                            ref={taskInputRef}
                            type="text"
                          />
                        </div>
                      </div>
                      {/* <Button onClick={() => talkHandler()}>Talk</Button> */}

                      <AudioRecorderComp
                        conversationsRef={conversationsRef}
                        sessionInfo={sessionInfo}
                        repeat={repeat}
                        talkHandler={talkHandler}
                      />
                      <div
                        onClick={handleEnd}
                        className="bg-red-500 hover:bg-red-600 simple-transition icon-hover h-[35px] flex justify-center items-center shadow-1 text-white cursor-pointer px-4 py-2 rounded-[10px]"
                      >
                        <Icon
                          className="hover:scale-[1.3] simple-transition"
                          icon="icomoon-free:phone-hang-up"
                        />
                      </div>
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
              {peerConnection &&
                sessionInfo &&
                sessionState === "connected" && (
                  <AvatarConversationsLive
                    conversationsRef={conversationsRef}
                  />
                )}
            </div>
            <canvas ref={canvasElementRef} style={{ display: "none" }} />{" "}
          </div>
        </div>
        {/* {conversationsRef.current.map((item) => {
          return <div key={item.content}>{item.content}</div>;
        })} */}
      </div>
      <InfoModal
        handleClick={() => {
          createNewSession().then(() => {});
        }}
      />
      <EndCallModal
        handleSubmit={() => {
          markComplete();
          handleStopAndUpload();
        }}
        handleRetry={() => {
          conversationsRef.current = [];
          closeConnectionHandler();
        }}
      />
    </div>
  );
}
