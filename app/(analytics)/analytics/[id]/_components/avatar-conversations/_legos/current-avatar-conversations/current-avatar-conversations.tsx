import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { StringFormats } from "@/lib/StringFormats";
import * as Tabs from '@radix-ui/react-tabs';

const CurrentAvatarConversations = ({
  currentAvatarConversations,
}: {
  currentAvatarConversations: any;
}) => {
  const [activeConversation, setActiveConversation] = useState(0);
  console.log(currentAvatarConversations);
  return (
    <div className="flex w-full h-full satoshi">
      <div className="w-[20%] h-[90vh] p-2 overflow-y-scroll flex flex-col gap-2 border-r border-r-gray-100">
        {currentAvatarConversations?.map((conversation: any, idx: any) => {
          return (
            <div
              className={`p-2 border p-small-medium border-gray-100 cursor-pointer flex items-center gap-2 rounded-[8px] simple-transition hover:bg-gray-100 ${activeConversation === idx ? "bg-gray-100" : ""
                }`}
              onClick={() => {
                setActiveConversation(idx);
              }}
              key={idx}
            >
              <Icon icon="carbon:recording" />
              <p className="">Recording {idx + 1}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col w-[80%] h-full">
        <video
          typeof="video/mp4"
          className="border border-gray-100 aspect-video h-[40vh]"
          src={currentAvatarConversations?.[activeConversation]?.recording_url}
          controls
          autoPlay
        ></video>
        <Tabs.Root defaultValue="tab1">
          <Tabs.List aria-label="Manage your account">
            <Tabs.Trigger value="tab1">Transcript</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Summary</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Feedback</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <div className="flex flex-col overflow-y-scroll satoshi h-[50vh]">
              <h1 className="px-2 pt-4 pb-2 h2-medium">Transcript</h1>
              <hr />
              {currentAvatarConversations?.[activeConversation]?.conversation?.map(
                (item: any, idx: any) => {
                  return (
                    item.role !== "system" && (
                      <div
                        key={idx}
                        className={`p-2 ${idx % 2 === 1 ? "bg-gray-100" : ""
                          } flex items-start gap-2 text-[14px] text-gray-700`}
                      >
                        <p className="min-w-[70px]">
                          {StringFormats.capitalizeFirstLetterOfEachWord(item.role)}
                        </p>
                        <p>{item.content}</p>
                      </div>
                    )
                  );
                }
              )}
            </div>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <div>
              <h1 className="px-2 pt-4 pb-2 h2-medium">Summary</h1>
              <p>{currentAvatarConversations?.[activeConversation]?.summary}</p>
            </div>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <div>
              <h1 className="px-2 pt-4 pb-2 h2-medium">Feedback</h1>
              <p>{currentAvatarConversations?.[activeConversation]?.feedback}</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default CurrentAvatarConversations;
