export const avatars = [
  {
    id: "josh_lite3_20230714",
    voice_id: "1ae3be1e24894ccabdb4d8139399f721",
    name: "Josh",
  },
];

export const heygen_API = {
  apiKey: "NWJlZjg2M2FkMTlhNDdkYmE4YTQ5YjlkYTE1NjI2MmQtMTcxNTYyNTMwOQ==",
  serverUrl: "https://api.heygen.com",
};

export const apiKey = heygen_API.apiKey;
export const heygenBaseUrl = heygen_API.serverUrl;
// export const currentCourseId: string =
//   process.env.NEXT_PUBLIC_CURRENT_COURSE_ID!;
export const admin = "org:admin";
export const member = "org:member";

export const lessonStatuses = {
  approved: "approved",
  pending: "pending",
  approvalPending: "approval-pending",
  rejected: "rejected",
};

export const basePrompt = `
  "You are an Ai assistant"
`;
export const color: string[] = [
  "#95daf5",
  "#91ffb6",
  "#FFBB5C",
  "#faab82",

  "#f98383",
  "#eed4fc",
];
export const textFromBg: {
  "#95daf5": "#0b4054";
  "#91ffb6": "#1a6e36";
  "#FFBB5C": "#422d10";
  "#faab82": "#541e02";
  "#f98383": "#470101";
  "#eed4fc": "#28043b";
  [key: string]: string;
} = {
  "#95daf5": "#0b4054",
  "#91ffb6": "#1a6e36",
  "#FFBB5C": "#422d10",
  "#faab82": "#541e02",
  "#f98383": "#470101",
  "#eed4fc": "#28043b",
};

export const colors: {
  lightblue: "#95daf5";
  lightgreen: "#91ffb6";
  lightgold: "#FFBB5C";
  lightorange: "#faab82";
  lightred: "#f98383";
  lightpurple: "#eed4fc";
  [key: string]: string;
} = {
  lightblue: "#95daf5",
  lightgreen: "#91ffb6",
  lightgold: "#FFBB5C",
  lightorange: "#faab82",
  lightred: "#f98383",
  lightpurple: "#eed4fc",
};
export const getBg = (idx: number) => color[idx % color.length];

export const analyticsTabsValues = {
  analytics: "analytics",
  avatarConversations: "avatarConversations",
};

export const lessonTypeText: {
  text: "Learning Material";
  avatar: "Live Training";
  video: "Video";
  [key: string]: string;
} = {
  text: "Learning Material",
  avatar: "Live Training",
  video: "Video",
};

export const lessonStatusText: {
  approved: "Complete";
  pending: "Incomplete";
  "approval-pending": "Requested Approval";
  [key: string]: string;
} = {
  approved: "Complete",
  pending: "Incomplete",
  "approval-pending": "Requested Approval",
};

export const specificAvatarIds = [
  "josh_lite3_20230714",
  "Angela-inblackskirt-20220820",
  "Anna_public_3_20240108",
  "Briana_public_3_20240110",
  "Eric_public_pro2_20230608",
  "Justin_public_3_20240308",
  "Kayla-incasualsuit-20220818",
  "Kristin_public_2_20240108",
  "Tyler-inshirt-20220721",
  "Wade_public_2_20240228",
  "Tyler-incasualsuit-20220721",
  "Wade_public_2_20240228",
  "Anna_public_20240108",
];
