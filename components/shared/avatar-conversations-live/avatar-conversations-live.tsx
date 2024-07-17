import { ScrollArea } from "@/components/ui/scroll-area";
import { responseLoadingAtom, userTranscriptLoadingAtom } from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const AvatarConversationsLive = ({
  conversationsRef,
  chat,
  setChat,
  talkHandler,
}: any) => {
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const responseLoading = useRecoilValue(responseLoadingAtom);
  const [userTranscriptLoading, setUserTranscriptLoading] = useRecoilState(
    userTranscriptLoadingAtom
  );

  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [conversationsRef.current.length, userTranscriptLoading, responseLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isStreaming = conversationsRef.current.some(
        (item: any) => item.isStreaming
      );
      if (isStreaming && !isUserScrolling) {
        scrollToBottom();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [conversationsRef]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10; 

      setIsUserScrolling(!isAtBottom);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10; 

      if (isAtBottom) {
        setIsUserScrolling(false);
      }
    }
  }, [conversationsRef.current.length]);

  return (
    <div className="bg-white flex flex-col h-[70vh] w-[320px] rounded-r-[20px] shadow-1">
      <div className="text-center border-b border-b-gray-200">
        <p className="text-[13px] px-2 py-3 text-gray-700 font-semibold">
          Live Transcript
        </p>
      </div>
      {conversationsRef.current.length === 0 && (
        <div className="flex gap-2 py-2 h-[70vh] items-center justify-center">
          <p className="text-gray-700 flex text-center w-fit text-[13px]">
            Start talking to the Avatar
          </p>
        </div>
      )}
      <div
        ref={scrollAreaRef}
        className="h-[70vh] flex flex-col gap-2 overflow-auto"
        onScroll={handleScroll}

      >
        {conversationsRef.current.length > 0 &&
          conversationsRef.current.map((item: any, index: any) => (
            <div
              className={`${
                item.role === "user"
                  ? "justify-end self-end justify-self-end flex-row-reverse"
                  : ""
              }  flex gap-2 px-4 py-2 items-start`}
              key={index}
            >
              <div
                className={`w-4 h-4 ${
                  item.role === "user" ? "mt-[2.5px]" : "mt-[1.5px]"
                } rounded-full`}
              >
                {item.role === "user" ? (
                  user ? (
                    <img
                      src={user?.imageUrl}
                      alt="user"
                      className="rounded-full w-4 h-4"
                    />
                  ) : (
                    <Icon
                      icon="fa-solid:user-alt"
                      className="text-black w-4 h-4 "
                    />
                  )
                ) : (
                  <img
                    src="/logo.png"
                    alt="avatar"
                    className="w-4 h-4 rounded-full"
                  />
                )}
              </div>
              <p
                className={`text-gray-700 p-2 w-fit max-w-[200px] text-[12px] ${
                  item.role === "user"
                    ? "self-end justify-end bg-gray-200 rounded-b-[17px] rounded-tl-[17px]"
                    : "bg-[#5475f5] text-white rounded-tr-[17px] rounded-b-[17px]"
                }`}
              >
                {item.isStreaming ? `${item.content} ...` : item.content}
              </p>
            </div>
          ))}

        {userTranscriptLoading !== 0 && (
          <div
            className={`${
              userTranscriptLoading === 1
                ? "justify-end self-end justify-self-end flex-row-reverse"
                : ""
            }  flex gap-2 px-4 py-2 w-max items-start`}
          >
            {userTranscriptLoading === 1 ? (
              user ? (
                <img
                  src={user?.imageUrl}
                  alt="user"
                  className="rounded-full w-4 h-4"
                />
              ) : (
                <Icon
                  icon="fa-solid:user-alt"
                  className="text-black w-4 h-4 "
                />
              )
            ) : (
              <img
                src="/logo.png"
                alt="avatar"
                className="w-4 h-4 rounded-full"
              />
            )}
            <div
              className={`text-gray-700 flex justify-center items-center p-2 w-[55px] text-[12px] ${
                userTranscriptLoading === 1
                  ? "self-end justify-end bg-gray-200 rounded-b-[17px] rounded-tl-[17px]"
                  : "bg-[#5475f5] text-white rounded-tr-[17px] rounded-b-[17px]"
              }`}
            >
              {userTranscriptLoading === 1 ? (
                <div className="message-loader-dark mr-1"></div>
              ) : (
                <div className="message-loader ml-1" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarConversationsLive;