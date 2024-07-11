"use client";
import Microphone from "@/components/shared/microphone/microhpone";
import { DeepgramContextProvider } from "@/context/Deepgram";
import { MicrophoneContextProvider } from "@/context/Microphone";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useDisclosure from "@/hooks/useDisclosure";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeLessonAtom,
  courseIdAtom,
  userAnalyticsAtom,
  userTranscriptLoadingAtom,
} from "@/store/atoms";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";
import { UserButton, useUser } from "@clerk/nextjs";
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
import { Avatar, Button } from "@nextui-org/react";
import StartCallModal from "@/components/shared/start-call-modal/start-call-modal";
import useStartCallModal from "@/hooks/useStartCallModal";
import {
  Configuration,
  NewSessionData,
  StreamingAvatarApi,
} from "@heygen/streaming-avatar";

import { evaluateScorecard } from "@/services/gpt.service";
import openIcon from "../../../../../../public/images/open.png";
import Image from "next/image";
import { generateRandomSegment } from "@/utils/helpers";
import Configure from "@/app/(video)/video/components/Configure";
const WebCamRecording = dynamic(
  () => import("./webcam-recording/webcam-recording"),
  { ssr: false }
);

function AvatarPracticeLesson({
  avatar_id,
  voice_id,
  thumbnail,
  avatar_name,
  lesson_id,
  lesson,
  setIsPracticeList,
}) {
  const {
    isEndCallModalOpen,
    onEndCallModalOpen,
    onEndCallModalClose,
    setIsEndCallModalOpen,
  } = useEndCallModal();

  const {
    isStartCallModalOpen,
    onStartCallModalOpen,
    onStartCallModalClose,
    setIsStartCallModalOpen,
  } = useStartCallModal();

  const {
    isInfoModalOpen,
    onInfoModalOpen,
    onInfoModalClose,
    setIsInfoModalOpen,
  } = useInfoModal();

  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [stream, setStream] = useState();
  const [debug, setDebug] = useState();
  const [avatarId, setAvatarId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const data = useRef(null);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [initialized, setInitialized] = useState(false); // Track initialization
  const [recording, setRecording] = useState(false); // Track recording state
  const mediaStream = useRef(null);
  const avatar = useRef(null);
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
  // const currentCourseId = useRecoilValue(courseIdAtom);
  const currentCourseId = "6667760f255b05556e58b41a";
  // const [cameraAllowed, setCameraAllowed] = useState(false);
  const cameraAllowed = useRef(false);
  const [scorecardAns, setScorecardAns] = useState([]);
  const [chat, setChat] = useState("");
  const [isStartCall, setIsStartCall] = useState(false);

  const { user } = useUser();

  const [randomNumber, setRandomNumber] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const markCompleteCalledRef = useRef(false);

  const heygen_API = {
    apiKey: "NWJlZjg2M2FkMTlhNDdkYmE4YTQ5YjlkYTE1NjI2MmQtMTcxNTYyNTMwOQ==",
    serverUrl: "https://api.heygen.com",
  };

  const apiKey = heygen_API.apiKey;
  const SERVER_URL = heygen_API.serverUrl;

  const randomSegment = generateRandomSegment();

  const handleSubmit = () => {
    // setCameraAllowed(true);
    cameraAllowed.current = true;
    startSession();
  };

  const handleRetry = () => {
    // setCameraAllowed(false);
    cameraAllowed.current = false;
    startSession();
  };

  useEffect(() => {
    const generateRandomNumber = () => {
      return Math.floor(Math.random() * 60) + 1;
    };

    setRandomNumber(generateRandomNumber());
  }, []);

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
      conversationsRef.current = [];
      setIsStartCall(false);
    };
  }, [activeLesson]);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current.play();
        setDebug("playing");
        // setTimeout(() => {
        //   handleSpeak({
        //     text: videoData[0]?.welcome_message,
        //     isWelcomeMessage: true,
        //   });
        // }, 2000);
      };
    }
  }, [mediaStream, stream]);

  async function talkToOpenAI(prompt, newPrompt) {
    const _data = await axios.post(`/api/complete`, {
      prompt,
      newPrompt: newPrompt || false,
      lesson_prompt: newPrompt ? lesson?.content?.prompt : null,
      sessionId: data.current?.sessionId,
    });

    if (_data.status === 500) {
      console.error("Server error");
      throw new Error("Server error");
    } else {
      return _data.data.text;
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
      conversationsRef.current = [
        ...conversationsRef.current,
        { role: "assistant", content: text },
      ];
      setUserTranscriptLoading(0);
      return data.data;
    }
  }

  async function talkHandler(text, newPrompt) {
    if (!data.current) {
      console.log("return talkHandler");
      return;
    }
    console.log(text);
    const prompt = text; // Using the same input for simplicity
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
        const resp = await repeat(data.current?.sessionId, text);
      } else {
        console.log("No response from AI");
      }
    } catch (error) {
      console.error("Error talking to AI:", error);
      toast.error("Error getting response");
    }
  }

  const handleStopAndUpload = async () => {
    if (!recorderRef.current) {
      endSession();
      return;
    }
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
        endSession();
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
  const markComplete = async () => {
    if (lesson?.status === "approved" || markCompleteCalledRef.current) return;
    console.log("markComplete");
    markCompleteCalledRef.current = true;
    const score = await evaluate();
    console.log("get score ", score);
    if (score) {
      if (lesson.submission === "automatic") {
        updateLessonForUser({
          user_id: user?.id,
          course_id: currentCourseId,
          lesson_id: lesson.id,
          data: {
            status: "approved",
            duration: Date.now() - currenTimeRef.current,
            completed_at: Date.now(),
            scorecard: score,
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
            scorecard: score,
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
    }
  };
  const handleEnd = () => {
    onEndCallModalOpen();
    setIsPracticeList(true);
  };

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/heygen/get-streaming-access-token", {
        method: "POST",
      });
      const token = await response.json();
      console.log("Access Token:", token.token); // Log the token to verify
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return "";
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    // toast.loading("Creating session");
    await updateToken();
    if (!avatar.current) {
      setDebug("Avatar API is not initialized");
      return;
    }
    try {
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatar_name,
            voice: { voiceId: voice_id },
          },
        },
        setDebug
      );
      // setData(res);
      data.current = res;
      setStream(avatar.current.mediaStream);
      setIsPracticeList(false);
      toast.dismiss();
    } catch (error) {
      console.error("Error starting avatar session:", error);
      toast.error("Error starting session");
      setDebug(
        `There was an error starting the session. ${
          voiceId ? "This custom voice ID may not be supported." : ""
        }`
      );
    }
    setIsLoadingSession(false);
  }

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log("Updating Access Token:", newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken?.token })
    );

    const startTalkCallback = (e) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e) => {
      console.log("Avatar stopped talking", e);
    };

    console.log("Adding event handlers:", avatar.current);
    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);

    setInitialized(true);
  }

  async function handleInterrupt() {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current
      .interrupt({ interruptRequest: { sessionId: data?.current?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
  }

  async function endSession() {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current.stopAvatar(
      { stopSessionRequest: { sessionId: data?.sessionId } },
      setDebug
    );
    // setData(null);
    data.current = null;
    setStream(undefined);
  }

  const evaluate = async () => {
    const data = {
      scorecardQuestions: lesson.scorecard_questions,
      conversation: conversationsRef.current,
    };

    const response = await evaluateScorecard(data);
    return response.answers;
    // setScorecardAns(response.answers);
    // console.log("gpt response 1 ", response.answers);
  };

  const sendChat = (e) => {
    if (e.key === "Enter") {
      setUserTranscriptLoading(2);
      if (conversationsRef.current) {
        conversationsRef.current = [
          ...conversationsRef.current,
          { role: "user", content: chat },
        ];
      }
      talkHandler(chat, false);
      setChat("");
    }
  };

  const sendChatFromIcon = (e) => {
    setUserTranscriptLoading(2);
    if (conversationsRef.current) {
      conversationsRef.current = [
        ...conversationsRef.current,
        { role: "user", content: chat },
      ];
    }
    talkHandler(chat, false);
    setChat("");
  };

  useEffect(() => {
    if (data.current?.sessionId) {
      setTimeout(() => {
        const welcome_message =
          "Hey welcome to the interactive video." + " " + lesson?.description;
        const resp = repeat(data.current?.sessionId, welcome_message);
      }, 2000);
    }
  }, [data.current?.sessionId]);

  return (
    <div className="w-full relative">
      <div className="h-[90vh] w-full flex  flex-col">
        <div className="w-full flex flex-col gap-3 mt-5 relative justify-center items-center">
          {!data?.current?.sessionId && (
            <>
              {isStartCall ? (
                <div className="border-1 rounded-lg p-7 shadow-lg">
                  <Configure
                    startSession={startSession}
                    cameraAllowed={cameraAllowed}
                    isLoadingSession={isLoadingSession}
                  />
                </div>
              ) : (
                <div className="border-1 shadow-lg border-gray-300 flex justify-center flex-col items-center h-fit p-5 rounded-xl relative">
                  <div className="flex self-start gap-2 py-3 items-center justify-between pl-2">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      src={lesson.content.avatar.normal_thumbnail_small}
                    />
                    <div className="flex flex-col pl-2">
                      <p className="max-w-[300px] truncate text-sm font-semibold capitalize">
                        {lesson.title}
                      </p>
                    </div>
                    <div
                      className="absolute right-4 top-4 cursor-pointer"
                      onClick={() => {
                        window.open(
                          `/video/${randomSegment}/${lesson.id}`,
                          "_blank"
                        );
                      }}
                      title="Open in new tab"
                    >
                      <Image src={openIcon} width={20} height={20} />
                      {/* <Icon
                      icon="fluent-mdl2:open-in-new-tab"
                      className="w-4 h-4"
                    /> */}
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <img
                      src={thumbnail}
                      alt="ai-avatar"
                      className="object-cover w-[150px] h-[150px] md:rounded-full shadow-lg"
                    />
                    <Icon
                      icon="fluent-emoji-flat:green-circle"
                      className="w-6 h-6 bg-white border-2 border-white rounded-full absolute bottom-2 right-2"
                    />
                  </div>

                  <p className="mt-5 text-[#71717A] text-center text-sm capitalize w-[300px]">
                    {lesson?.description}
                  </p>
                  <div className="flex mt-3">
                    <div className="bg-gray-100 px-2 py-[2px] text-xs rounded-lg font-semibold">
                      {" "}
                      Live Training
                    </div>
                    <div className="ml-2 border border-gray-400 px-2 py-[2px] text-xs rounded-lg font-semibold">
                      {" "}
                      {lesson.content.voice.display_name.split("-")[1]}
                    </div>
                    {/* <div className="ml-2 border px-2 py-[2px] text-xs rounded-lg font-semibold bg-black text-white">
                {" "}
                Book rate : {randomNumber}%

              </div> */}
                  </div>
                  <Button
                    className="py-6 start-gradient text-white text-lg border-none mt-5 w-[400px] cursor-pointer"
                    onClick={() => {
                      setIsStartCall(true);
                    }}
                  >
                    <Icon icon="fluent:call-24-regular" className="w-6 h-6" />
                    Start Call
                  </Button>
                </div>
              )}
            </>
          )}
          <div className="h-fit pl-10 flex flex-col justify-center gap-3 items-center relative py-8">
            {data?.current?.sessionId && (
              <div className="flex self-start gap-2 py-3 items-center justify-between pl-2">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={lesson.content.avatar.normal_thumbnail_small}
                />
                <div className="flex flex-col pl-2">
                  <h1 className="text-sm text-black font-semibold self-start">
                    {StringFormats.capitalizeFirstLetterOfEachWord(
                      lesson?.title
                    )}
                  </h1>
                  <p className="text-gray-800 text-sm">{lesson?.description}</p>
                </div>
              </div>
            )}
            <div className="flex">
              <div className="relative">
                <video
                  align="center"
                  className="h-[70vh] shadow-lg w-full md:w-auto md:rounded-l-[20px] object-cover mx-auto self-center"
                  ref={mediaStream}
                  autoPlay
                  style={{
                    display: data?.current?.sessionId ? "block" : "none",
                  }}
                />

                {cameraAllowed.current ? (
                  data?.current?.sessionId && (
                    <WebCamRecording
                      recorderRef={recorderRef}
                      mediaElementRef={mediaStream}
                      handleStopAndUpload={handleStopAndUpload}
                    />
                  )
                ) : (
                  <>
                    {data?.current?.sessionId && (
                      <div className="shadow-lg border border-gray-300 bg-gray-700 absolute bottom-[1rem] h-[120px] w-[180px] right-5 rounded-[20px] flex items-center justify-center">
                        <UserButton className="w-40 h-40" />
                      </div>
                    )}
                  </>
                )}
                {data?.current?.sessionId && (
                  <div className="flex gap-2  right-[27%] absolute bottom-[1rem]">
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <input
                          value={chat}
                          onChange={(e) => {
                            setChat(e.target.value);
                          }}
                          placeholder="Type a message here..."
                          className="text-gray-100 px-2 glassmorphic-effect-1 placeholder:text-gray-300 text-sm pr-8 placeholder:text-[13px] pb-1 h-9 !outline-none !border-none focus:outline-none focus:border-none w-[150px] md:w-[220px] rounded-[20px] bg-transparent "
                          onKeyDown={sendChat}
                          type="text"
                        />
                        <Icon
                          icon="lets-icons:send-hor"
                          className="rounded-full w-6 h-6 absolute right-2 top-1.5 cursor-pointer text-white"
                          onClick={sendChatFromIcon}
                        />
                      </div>
                    </div>
                    {/* <Button onClick={() => talkHandler()}>Talk</Button> */}

                    <AudioRecorderComp
                      conversationsRef={conversationsRef}
                      sessionInfo={data}
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
              {data?.current?.sessionId && (
                <AvatarConversationsLive conversationsRef={conversationsRef} />
              )}
            </div>
            <canvas ref={canvasElementRef} style={{ display: "none" }} />{" "}
          </div>
        </div>
        {/* {conversationsRef.current.map((item) => {
        return <div key={item.content}>{item.content}</div>;
      })} */}
      </div>
      {/* <InfoModal
        handleClick={() => {
          createNewSession().then(() => {});
        }}
      /> */}
      <EndCallModal
        handleSubmit={() => {
          console.log("ended session");
          markComplete();
          handleStopAndUpload();
        }}
        handleRetry={() => {
          conversationsRef.current = [];
          endSession();
        }}
      />
      <StartCallModal handleSubmit={handleSubmit} handleRetry={handleRetry} />
    </div>
  );
}

export default AvatarPracticeLesson;
