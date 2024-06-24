import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useRef } from "react";

const AvatarConversationsLive = ({
  conversationsRef,
}: {
  conversationsRef: any;
}) => {
  const { user } = useUser();
  const scrollAreaRef = useRef<any>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationsRef.current.length]);
  return (
    <ScrollArea className="flex flex-col gap-4 h-[70vh] w-[320px] rounded-r-[20px] shadow-1">
      <div className="text-center border-b border-b-gray-200 mb-2">
        <p className="text-[13px] px-2 py-3 text-gray-700 font-medium">
          Live Transcript
        </p>
      </div>
      {conversationsRef.current.length === 0 && (
        <div className="flex gap-2 py-2 h-[70vh] items-center justify-center">
          <p className="text-gray-700 text-center w-[250px] text-[13px]">
            Start talking to the Avatar
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {conversationsRef.current.length > 0 &&
          conversationsRef.current.map((item: any) => {
            return (
              <div
                ref={scrollAreaRef}
                className={`${
                  item.role === "user"
                    ? "justify-end self-end justify-self-end flex-row-reverse"
                    : ""
                }  flex gap-2 px-4 py-2 items-start`}
                key={item.content}
              >
                <div
                  className={`w-4 h-4 ${
                    item.role === "user" ? "mt-[2.5px]" : "mt-[1.5px]"
                  } rounded-full`}
                >
                  {item.role === "user" ? (
                    <img
                      src={user?.imageUrl}
                      alt="user"
                      className="rounded-full w-4 h-4"
                    />
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
                  {item.content}
                </p>
              </div>
            );
          })}
      </div>
    </ScrollArea>
  );
};

export default AvatarConversationsLive;
