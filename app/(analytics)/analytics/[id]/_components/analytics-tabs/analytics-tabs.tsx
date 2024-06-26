import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyticsTabsValues } from "@/lib/constants";
import React, { useEffect, useRef } from "react";
import UserLessonAnalytics from "../user-lesson-analytics/user-lesson-analytics";
import AvatarConversations from "../avatar-conversations/avatar-conversations";
import { useRecoilState } from "recoil";
import {
  analyticsTabValueAtom,
  currentAvatarConversationAtom,
} from "@/store/atoms";

const AnalyticsTabs = () => {
  const tabRef = useRef<any>(null);
  const [tabValue, setTabValue] = useRecoilState(analyticsTabValueAtom);
  const [currentAvatarConversation, setCurrentAvatarConversation] =
    useRecoilState(currentAvatarConversationAtom);
  useEffect(() => {
    if (tabRef.current === null) return;
    tabRef.current.click();
    if (tabValue === analyticsTabsValues.analytics) {
      setCurrentAvatarConversation(null);
    }
  }, [tabValue, tabRef]);

  return (
    <Tabs
      value={tabValue}
      defaultValue={analyticsTabsValues.analytics}
      className=" overflow-hidden outline-none  rounded-[20px]"
    >
      <TabsList
        ref={tabRef}
        className="!hidden focus-visible:none group-focus-visible:none ring-0 w-full outline-none hidden-unset"
      >
        <TabsTrigger
          onClick={() => setTabValue(analyticsTabsValues.analytics)}
          className="w-[50%] hidden outline-none rounded-[20px] hidden-unset"
          value={analyticsTabsValues.analytics}
        >
          Analytics
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setTabValue(analyticsTabsValues.avatarConversations)}
          className="w-[50%] hidden hidden-unset outline-none rounded-[20px]"
          value={analyticsTabsValues.avatarConversations}
        >
          Avatar Conversations
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className="outline-none"
        value={analyticsTabsValues.analytics}
      >
        <UserLessonAnalytics />
      </TabsContent>
      <TabsContent
        value={analyticsTabsValues.avatarConversations}
        className="m-0 outline-none"
      >
        <AvatarConversations />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
