import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyticsTabsValues } from "@/lib/constants";
import React from "react";
import UserLessonAnalytics from "../user-lesson-analytics/user-lesson-analytics";
import AvatarConversations from "../avatar-conversations/avatar-conversations";

const AnalyticsTabs = () => {
  const [tabValue, setTabValue] = React.useState(analyticsTabsValues.analytics);
  return (
    <Tabs
      value={tabValue}
      defaultValue={analyticsTabsValues.analytics}
      className=" overflow-hidden rounded-[20px]"
    >
      <TabsList className="w-full">
        <TabsTrigger
          onClick={() => setTabValue(analyticsTabsValues.analytics)}
          className="w-[50%] rounded-[20px]"
          value={analyticsTabsValues.analytics}
        >
          Analytics
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setTabValue(analyticsTabsValues.avatarConversations)}
          className="w-[50%] rounded-[20px]"
          value={analyticsTabsValues.avatarConversations}
        >
          Avatar Conversations
        </TabsTrigger>
      </TabsList>
      <TabsContent value={analyticsTabsValues.analytics}>
        <UserLessonAnalytics />
      </TabsContent>
      <TabsContent
        value={analyticsTabsValues.avatarConversations}
        className="m-0"
      >
        <AvatarConversations />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
