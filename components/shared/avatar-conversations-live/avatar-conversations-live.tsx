import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";

const AvatarConversationsLive = ({
  conversationsRef,
}: {
  conversationsRef: any;
}) => {
  const scrollAreaRef = useRef<any>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationsRef.current.length]);
  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex flex-col gap-4 h-[70vh] p-4 w-[300px] rounded-r-[20px] shadow-1"
    >
      {conversationsRef.current.length === 0 && (
        <div className="flex gap-2 py-2 h-[70vh] items-center justify-center">
          <p className="text-gray-700 text-center w-[250px] text-[13px]">
            Start talking to the Avatar
          </p>
        </div>
      )}
      {conversationsRef.current.length > 0 &&
        conversationsRef.current.map((item: any) => {
          return (
            <div className="flex gap-2 py-2 items-start" key={item.content}>
              <div
                className={`w-3 h-3 mt-1 rounded-full ${
                  item.role === "user" ? "bg-gray-500" : "bg-red-400"
                }`}
              ></div>
              <p className="text-gray-700 w-[250px] text-[13px]">
                {item.content}
              </p>
            </div>
          );
        })}
    </ScrollArea>
  );
};

export default AvatarConversationsLive;
