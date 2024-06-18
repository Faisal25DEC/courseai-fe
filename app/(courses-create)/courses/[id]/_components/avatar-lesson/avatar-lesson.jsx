"use client";
import Microphone from "@/components/shared/microphone/microhpone";
import { DeepgramContextProvider } from "@/context/Deepgram";
import { MicrophoneContextProvider } from "@/context/Microphone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
// import { avatars } from "@/lib/constants";
// import Loader from "@/components/shared/loader/loader";
// import Navbar from "@/components/shared/navbar/navbar";
import useDisclosure from "@/hooks/useDisclosure";
import { useRecoilState } from "recoil";
import { activeLessonAtom } from "@/store/atoms";
import Modal from "@/components/shared/modal/index";
import Webcam from "react-webcam";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { v4 as uuidv4 } from "uuid";
import { currentCourseId } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";

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
  const currenTimeRef = useRef(null);
  // const [webCamState, setWebCamState] = useState(null);
  // const [blob, setBlob] = useState(null);
  const recorderRef = useRef(null);
  const { user } = useUser();

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
    console.log("talking to openai");
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
        console.log(resp);
        setTimeout(() => {
          setAITalking(false);
        }, resp.duration_ms);
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
      console.log("response", response);
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

  const handleCheckboxChange = () => {
    const isChecked = bgCheckboxRef.current.checked;
    if (!sessionInfo) {
      alert("Please create a connection first");
      bgCheckboxRef.current.checked = false;
      return;
    }
    if (isChecked) {
      canvasElementRef.current.style.display = "block";
      mediaElementRef.current.style.display = "none";
    } else {
      canvasElementRef.current.style.display = "none";
      mediaElementRef.current.style.display = "block";
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
      console.log("Received ICE candidate:", candidate);
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
  // useEffect(() => {
  //   if (peerConnection && sessionInfo) {
  //     startAndDisplaySession();
  //   }
  // }, [peerConnection, sessionInfo]);
  // useEffect(() => {
  //   const triggerSession = async () => {
  //     try {
  //       await createNewSession();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   triggerSession();
  // }, [mediaElementRef.current]);
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

  // console.log("conversations", conversationsRef.current);

  const handleStopAndUpload = () => {
    recorderRef.current.stopRecording(() => {
      blob = recorderRef.current.getBlob();
      var formData = new FormData();
      const fileName = uuidv4() + ".webm";
      formData.append(fileName, blob);

      fetch(
        `https://dashboard-api-dev.permian.ai/users/${user?.id}/analytics/${currentCourseId}/lessons/${lesson_id}/recordings`,
        {
          method: "POST",
          body: formData,
        }
      );
    });
  };

  useEffect(() => {
    return () => {
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

  return (
    <div className="w-full">
      {/* <Navbar /> */}
      {/* <p className="text-center text-gray-600 flex justify-center font-medium items-center text-xl pb-4">
        Consolidated Assurance Demo
      </p> */}
      <div className="h-[90h] w-full flex  flex-col">
        <div className="w-full flex flex-col gap-3 mt-3 relative justify-center items-center">
          {(!peerConnection ||
            !sessionInfo ||
            sessionState !== "connected") && (
            <div className="flex justify-center items-center  w-full">
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
                className="object-cover md:rounded-[20px] shadow-lg"
              />
            </div>
          )}
          <div className="h-fit flex flex-col justify-center gap-3 items-center relative py-8">
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <div className="w-[98%] mx-auto flex justify-end">
                <Button
                  onClick={onOpen}
                  variant={"outline"}
                  className="self-end"
                >
                  Knowledge Base
                </Button>{" "}
              </div>
            )}
            <video
              align="center"
              className="h-[60vh] shadow-lg w-full md:w-auto md:rounded-[20px] object-cover mx-auto self-center"
              ref={mediaElementRef}
              autoPlay
              style={{
                display: sessionState === "connected" ? "block" : "none",
              }}
            />
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <Webcam
                audio={true}
                audioConstraints={audioConstraints}
                className="absolute bottom-[2.5rem] h-[120px] w-[210px] right-2 rounded-[20px] flex items-center justify-center"
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={startRecording}
              ></Webcam>
            )}
            <canvas ref={canvasElementRef} style={{ display: "none" }} />{" "}
            {peerConnection && sessionInfo && sessionState === "connected" && (
              <div className="flex gap-2 items-end absolute bottom-[3rem]">
                <div className="flex flex-col gap-2">
                  <div className="relative">
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
                    {/* {aiLoading && (
                      <div className="absolute right-2 text-white absolute-center-top">
                        <Loader
                          width={"20px"}
                          className="mt-[8px] border-neutral-200"
                        />
                      </div>
                    )} */}
                  </div>
                </div>
                {/* <Button onClick={() => talkHandler()}>Talk</Button> */}
                <MicrophoneContextProvider>
                  <DeepgramContextProvider>
                    <Microphone
                      talkHandler={talkHandler}
                      taskInputRef={taskInputRef}
                    />
                  </DeepgramContextProvider>
                </MicrophoneContextProvider>
              </div>
            )}
          </div>
        </div>
        {conversationsRef.current.map((item) => {
          return <div key={item.content}>{item.content}</div>;
        })}
      </div>
      <Modal isOpen={isOpen} onClose={onClose} className={"w-[100%]"}>
        <div className="flex flex-col gap-2 p-3 ">
          <div>
            <h2 className="text-[18px] font-medium text-gray-600">
              Knowledge Base
            </h2>
          </div>
          <div>
            <textarea
              onChange={(e) => setKnowledgeBase(e.target.value)}
              value={knowledgeBase}
              rows={15}
              className="w-[100%] border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant={"outline"} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={async () => {
                if (knowledgeBase.trim() === "") {
                  toast.error("Knowledge base cannot be empty");
                  onClose();
                  return;
                } else {
                  await talkToOpenAI(knowledgeBase, true);
                  onClose();
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
