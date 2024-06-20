export const avatars = [
  {
    id: "josh_lite3_20230714",
    voice_id: "1ae3be1e24894ccabdb4d8139399f721",
    name: "Josh",
  },
];

export const heygen_API = {
  apiKey: "YWUxN2ZhNmE3N2Y4NGMxYzg1OTc5NjRkMDk2ZTNhNzgtMTcxNTYyODk2MA==",
  serverUrl: "https://api.heygen.com",
};

export const apiKey = heygen_API.apiKey;
export const heygenBaseUrl = heygen_API.serverUrl;
export const currentCourseId = "6667760f255b05556e58b41a";
export const admin = "org:admin";
export const member = "org:member";

export const lessonStatuses = {
  approved: "approved",
  pending: "pending",
  approvalPending: "approval-pending",
  rejected: "rejected",
};
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
