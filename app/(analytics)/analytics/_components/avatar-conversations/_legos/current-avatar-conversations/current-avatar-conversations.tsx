import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { StringFormats } from "@/lib/StringFormats";
import {
  activeLessonAtom,
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
  lessonsArray,
  avatarLessonAnalyticsArray,
}: {
  currentAvatarConversations: any;
  lessonsArray: any;
  avatarLessonAnalyticsArray: any;
}) => {
  const [activeConversation, setActiveConversation] = useState(0);
  const [tabValue, setTabValue] = useRecoilState(analyticsTabValueAtom);
  const [currentAvatarConversation, setCurrentAvatarConversation] =
    useRecoilState(currentAvatarConversationAtom);
  const [activeLessons, setactiveLessons] = useRecoilState(activeLessonAtom);
  const [scorecardQuestions, setScorecardQuestions] = useState<any>([]);
  const [scorecardAns, setScorecardAns] = useState<any>([]);

  const handleGoBack = () => {
    setCurrentAvatarConversation(null);
    setTabValue(analyticsTabsValues.analytics);
  };

  console.log(
    "lessons===>",
    lessonsArray.filter((ls: any) => ls.id === activeLessons),
    scorecardQuestions
  );

  useEffect(() => {
    const current_lesson = lessonsArray.find(
      (ls: any) => ls.id === activeLessons
    );

    const current_analytics = avatarLessonAnalyticsArray.find(
      (ls: any) => ls.id === activeLessons
    );

    console.log("Current Analytics: ", current_analytics); // Debugging log
    console.log("Current Lesson: ", current_lesson); // Debugging log

    if (current_analytics) {
      console.log("Setting scorecardAns: ", current_analytics.scorecard); // Debugging log
      setScorecardAns(current_analytics.scorecard || []);
    }

    if (current_lesson) {
      console.log(
        "Setting scorecardQuestions: ",
        current_lesson.scorecard_questions
      ); // Debugging log
      setScorecardQuestions(current_lesson.scorecard_questions || []);
    }
  }, [lessonsArray, activeLessons, avatarLessonAnalyticsArray]);

  console.log("ansssssss", scorecardAns[0]);

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
                Scorecard
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
                <div className="grid grid-cols-2 gap-4 h-fit overflow-y-scroll p-4">
                  {scorecardQuestions.map((qs: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col gap-14 shadow-md border-1 rounded-lg p-3 text-[15px] text-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <p className="max-w-[90%] text-sm font-semibold overflow-hidden text-ellipsis whitespace-normal">
                          {qs}
                        </p>

                        <div className="bg-gray-100 rounded-lg px-2 py-1 text-xs font-semibold w-fit">
                          0/{scorecardAns[index] === false ? "0" : "1"}
                        </div>
                      </div>
                      {scorecardAns[index] === false ? (
                        <Icon
                          icon="healthicons:no"
                          className="text-red-500 w-5 h-5"
                        />
                      ) : (
                        <Icon
                          icon="healthicons:yes"
                          className="text-green-500 w-5 h-5"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CurrentAvatarConversations;
