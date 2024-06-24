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
    <ScrollArea className="flex flex-col gap-4 h-[70vh] p-4 w-[320px] rounded-r-[20px] shadow-1">
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
            <div
              ref={scrollAreaRef}
              className="flex gap-2 py-2 items-start"
              key={item.content}
            >
              <div className={`w-4 h-4 mt-[1.5px] rounded-full`}>
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
              <p className="text-gray-700 w-[240px] text-[13px]">
                {item.content}
              </p>
            </div>
          );
        })}
    </ScrollArea>
  );
};

export default AvatarConversationsLive;
