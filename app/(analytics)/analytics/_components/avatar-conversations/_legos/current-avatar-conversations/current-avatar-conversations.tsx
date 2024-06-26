import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { StringFormats } from "@/lib/StringFormats";
import {
  analyticsTabValueAtom,
  currentAvatarConversationAtom,
} from "@/store/atoms";
import { useRecoilState } from "recoil";
import { ChevronLeft } from "lucide-react";
import { analyticsTabsValues } from "@/lib/constants";
// import * as Tabs from '@radix-ui/react-tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CurrentAvatarConversations = ({
  currentAvatarConversations,
}: {
  currentAvatarConversations: any;
}) => {
  const [activeConversation, setActiveConversation] = useState(0);
  const [tabValue, setTabValue] = useRecoilState(analyticsTabValueAtom);
  const [currentAvatarConversation, setCurrentAvatarConversation] =
    useRecoilState(currentAvatarConversationAtom);

  const handleGoBack = () => {
    setCurrentAvatarConversation(null);
    setTabValue(analyticsTabsValues.analytics);
  };
  return (
    <div className="flex w-full h-full satoshi">
      <div className="w-[20%] h-[90vh] p-2 overflow-y-scroll flex flex-col gap-2 border-r border-r-gray-100">
        <div
          onClick={handleGoBack}
          className="cursor-pointer flex items-center gap-[1px] text-gray-700 "
        >
          <ChevronLeft className="text-gray-500 w-5 h-5" />
          <p>Back</p>
        </div>
        {currentAvatarConversations?.map((conversation: any, idx: any) => {
          return (
            <div
              className={`p-2 border p-small-medium border-gray-100 cursor-pointer flex items-center gap-2 rounded-[8px] simple-transition hover:bg-gray-100 ${
                activeConversation === idx ? "bg-gray-100" : ""
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
          preload="metadata"
          typeof="video/mp4"
          className="border border-gray-100 aspect-video h-[40vh]"
          src={currentAvatarConversations?.[activeConversation]?.recording_url}
          controls
          autoPlay
        ></video>
        <div className="w-full">
          <Tabs defaultValue="tab1">
            <TabsList aria-label="Manage your account" className="w-full">
              <TabsTrigger value="tab1" className="w-full">
                Transcript
              </TabsTrigger>
              <TabsTrigger value="tab2" className="w-full">
                Summary
              </TabsTrigger>
              <TabsTrigger value="tab3" className="w-full">
                Feedback
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="flex flex-col overflow-y-scroll satoshi h-[50vh]">
                <h1 className="px-2 pt-4 pb-2 h2-medium">Transcript</h1>
                <hr />
                {currentAvatarConversations?.[
                  activeConversation
                ]?.conversation?.map((item: any, idx: any) => {
                  return (
                    item.role !== "system" && (
                      <div
                        key={idx}
                        className={`p-2 ${
                          idx % 2 === 1 ? "bg-gray-100" : ""
                        } flex items-start gap-2 text-[14px] text-gray-700`}
                      >
                        <p className="min-w-[70px]">
                          {StringFormats.capitalizeFirstLetterOfEachWord(
                            item.role
                          )}
                        </p>
                        <p>{item.content}</p>
                      </div>
                    )
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className=" h-[50vh] overscroll-y-scroll">
                <h1 className="px-2 pt-2 pb-2 h2-medium">Summary</h1>
                <hr />
                <p className="p-3 text-[15px] text-gray-700">
                  {currentAvatarConversations?.[activeConversation]?.summary}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className=" h-[50vh] overflow-y-scroll">
                <h1 className="px-2 pt-2 pb-2 h2-medium">Feedback</h1>
                <hr />
                <p className="p-3 text-[15px] text-gray-700">
                  {currentAvatarConversations?.[activeConversation]?.feedback}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CurrentAvatarConversations;
