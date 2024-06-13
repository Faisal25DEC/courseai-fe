"use client";
import {
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import { useQueue } from "@uidotdev/usehooks";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import { utteranceText } from "@/lib/helpers";
import { DeepgramContextProvider, useDeepgram } from "@/context/Deepgram";
import {
  MicrophoneContext,
  MicrophoneContextProvider,
  useMicrophone,
} from "@/context/Microphone";
import Image from "next/image";

interface MicrophoneProps {
  setCaption?: (caption: string) => void;
  send: (value: string) => void;
  stopPrevAIAudioAndAskANewQuestion: () => void;
  stopAIAudio: any;
}
export default function Microphone({ taskInputRef, talkHandler }: any) {
  const [transcriptReady, setTranscriptReady] = useState(false);
  const { connection, connectionReady } = useDeepgram();
  const {
    microphoneOpen,
    microphone,
    queue: microphoneQueue,
    queueSize: microphoneQueueSize,
    firstBlob,
    removeBlob,
    stream,
    startMicrophone,
    microphoneTest,
    stopMicrophone,
    // microphoneOpen,
  } = useContext(MicrophoneContext);
  /**
   * Queues
   */
  const {
    add: addTranscriptPart,
    queue: transcriptParts,
    clear: clearTranscriptParts,
  } = useQueue<{ is_final: boolean; speech_final: boolean; text: string }>([]);
  /**
   * Refs
   */
  const messageMarker = useRef<null | HTMLDivElement>(null);
  const [isProcessing, setProcessing] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<string>();
  const [failsafeTimeout, setFailsafeTimeout] = useState<NodeJS.Timeout>();
  const [failsafeTriggered, setFailsafeTriggered] = useState<boolean>(false);

  const microphoneToggle = useCallback(
    async (e: Event) => {
      e.preventDefault();
      if (microphoneOpen) {
        stopMicrophone();
      } else {
        startMicrophone();
      }
    },
    [microphoneOpen, startMicrophone, stopMicrophone]
  );
  useEffect(() => {
    const onTranscript = (data: LiveTranscriptionEvent) => {
      setTranscriptReady(true);

      console.log("------IN TRASNSCRIPT------");
      let content = utteranceText(data);
      // i only want an empty transcript part if it is speech_final
      if (content !== "") {
      }
      if (content !== "" || data.speech_final) {
        /**
         * use an outbound message queue to build up the unsent utterance
         */
        addTranscriptPart({
          is_final: data.is_final as boolean,
          speech_final: data.speech_final as boolean,
          text: content,
        });
      }
    };
    const onOpen = (connection: LiveClient) => {
      // setTranscriptReady(false);
      let id: NodeJS.Timeout | null = null;
      while (true) {
        connection.addListener(
          LiveTranscriptionEvents.Transcript,
          onTranscript
        );
      }
    };
    if (connection) {
      connection.addListener(
        LiveTranscriptionEvents.Open,
        (connection: LiveClient) => {
          // setTranscriptReady(false);
          setTranscriptReady(false);
          let id: NodeJS.Timeout | null = null;
          connection.addListener(
            LiveTranscriptionEvents.Transcript,
            onTranscript
          );
        }
      );
    }
    return () => {
      connection?.removeListener(LiveTranscriptionEvents.Open, onOpen);
      connection?.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      );
    };
  }, [addTranscriptPart, connection]);
  const getCurrentUtterance = useCallback(() => {
    return transcriptParts.filter(({ is_final, speech_final }, i, arr) => {
      return speech_final || (!is_final && i === arr.length - 1);
    });
  }, [transcriptParts]);
  const [lastUtterance, setLastUtterance] = useState<number>();
  useEffect(() => {
    /**
     * failsafe was triggered since we last sent a message to TTS
     */
    const parts = getCurrentUtterance();
    const last = parts[parts.length - 1];
    const content = parts
      .map(({ text }) => text)
      .join(" ")
      .trim();
    /**
     * if the entire utterance is empty, don't go any further
     * for example, many many many empty transcription responses
     */
    if (!content || !last) return;
    if (content !== currentUtterance && last.speech_final === true) {
      console.log(parts, "------IN TRASNSCRIPT------", "----SPEECH_FINAL");
      taskInputRef.current.value = content;
      talkHandler(content);

      // setUserCaption && setUserCaption(content);
    }
    if (failsafeTriggered) {
      clearTranscriptParts();

      return;
    }
    /**
     * display the concatenated utterances
     */
    // setCurrentUtterance(content);
    // setUserCaption && setUserCaption(content);
    /**
     * record the last time we recieved a word

    /**
     * if the last part of the utterance, empty or not, is speech_final, send to the LLM.
     */
    if (last && last.is_final) {
      clearTimeout(failsafeTimeout);
      // append({
      //   role: "user",
      //   content,
      // });
      clearTranscriptParts();
    }
  }, [
    getCurrentUtterance,
    clearTranscriptParts,
    // append,
    failsafeTimeout,
    failsafeTriggered,
  ]);
  /**
   * magic microphone audio queue processing
   */
  useEffect(() => {
    const processQueue = async () => {
      if (microphoneQueueSize > 0 && !isProcessing) {
        setProcessing(true);
        if (connectionReady) {
          const nextBlob = firstBlob;
          if (nextBlob && nextBlob?.size > 0) {
            connection?.send(nextBlob);
          }
          removeBlob();
        }
        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 200);
      }
    };
    processQueue();
  }, [
    connection,
    microphoneQueue,
    removeBlob,
    firstBlob,
    microphoneQueueSize,
    isProcessing,
    connectionReady,
  ]);
  /**
   * keep deepgram connection alive when mic closed
   */
  useEffect(() => {
    let keepAlive: any;

    if (connection && connectionReady && !microphoneOpen) {
      keepAlive = setInterval(() => {
        // should stop spamming dev console when working on frontend in devmode
        if (connection?.getReadyState() !== LiveConnectionState.OPEN) {
          clearInterval(keepAlive);
        } else {
          connection.keepAlive();
        }
      }, 10000);
    } else {
      clearInterval(keepAlive);
    }
    // prevent duplicate timeouts
    return () => {
      clearInterval(keepAlive);
    };
  }, [connection, connectionReady, microphoneOpen]);
  useEffect(() => {
    if (connection && connectionReady) {
      startMicrophone();
    }
  }, [connection, connectionReady]);
  return (
    <div className="relative btn-gradient btn-glow px-[.55rem] !h-9 w-[fit-content] z-[99999999999]">
      <div className="">
        <a href="#" onClick={(e: any) => microphoneToggle(e)} className={``}>
          {microphoneOpen && (
            <div className="w-5 hover:scale-[1.2] transition-all duration-200 ease-linear items-center text-white justify-center flex shrink-0">
              {/* <MicrophoneIcon
                micOpen={microphoneOpen}
                className="text-white h-5"
              /> */}
              {transcriptReady ? (
                microphone?.state === "recording" && connectionReady ? (
                  <div className="wavy-loader" />
                ) : (
                  <img src="/mic-unmute.svg" alt="" className="h-[1.15rem]" />
                )
              ) : (
                <div className="loader" />
              )}
            </div>
          )}
          <div className="w-5 flex items-center  justify-center shrink-0">
            {!microphoneOpen && (
              <img src="/mic-mute.svg" alt="" className="h-[1.15rem]" />
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
