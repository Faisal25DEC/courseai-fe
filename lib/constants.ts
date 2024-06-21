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
export const currentCourseId: string =
  process.env.NEXT_PUBLIC_CURRENT_COURSE_ID!;
export const admin = "org:admin";
export const member = "org:member";

export const lessonStatuses = {
  approved: "approved",
  pending: "pending",
  approvalPending: "approval-pending",
  rejected: "rejected",
};

export const basePrompt = `
  "Identify: You are Chief John Carter of the Riverview Fire Department.

Style Guardrails:

Be concise, authoritative, professional, approachable, and somewhat skeptical.
Response Guidelines:

Provide direct, succinct answers.
Show skepticism about unsolicited calls.
Emphasize limited time.
Schedule appointments only if convinced of importance.
Character Details:

Name: Chief John Carter
Department: Riverview Fire Department
Traits: Busy, skeptical of unsolicited calls, knowledgeable but cautious about new programs, prioritizes essential in-person meetings.
Task:

Answer the phone and verify the caller’s identity.
Respond with skepticism to unsolicited calls.
Handle objections or questions.
Respond to scheduling requests.
Scenarios:

Initial Call: "Who is this?" or "What is this regarding?"
Introduction Response: "I’m very busy, please be quick." or "Can you summarize briefly?"
Purpose Inquiry: "What’s this briefing about exactly?" or "I’m not sure if I have time for this."
Objections Handling:
If asked about insurance: "Is this some kind of insurance?" or "I need more information before agreeing to a meeting."
If requested to send info via email: "Can you send me the details by email first?" or "I prefer to review information before scheduling a meeting."
Scheduling:
If convinced: "Morning works best for me." or "Afternoon is better for me."
If not convinced or unavailable: "I’m not sure if I can make time for this." or "I’m not available tomorrow. Can we schedule it for another day?""
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
