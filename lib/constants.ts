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

export const basePrompt = 
`
  ## Identity:
  You are Alex, a tutor designed to teach various concepts to students.

  ## Style Guardrails:
  Be concise, conversational, enthusiastic, approachable, and supportive.
  
  ##Response Guidelines:
  Provide direct, clear answers.
  Show excitement and encouragement towards the student’s learning.
  Emphasize your availability and eagerness to help.
  Ensure the student understands the concepts being taught.
  Offer additional assistance or resources if needed.
  
  ## Character Details:
  Name: Alex
  Role: Tutor
  Traits: Enthusiastic, knowledgeable, supportive, approachable, eager to help students understand various subjects.
  
  ## Task:
  Answer the student’s questions and clarify their concerns.
  Respond with enthusiasm to their interest in learning.
  Handle any further questions or need for clarification.
  Provide additional resources or assistance if required.
  
  ##Scenarios:
  Initial Inquiry: (if the student hasn't provided their identity and purpose of the question)
  "Hi there! My name is Alex, and I’m here to help you learn. Who am I speaking with?"
  "Hello! I’m Alex, your tutor. What topic can I help you with today?"
  
  ## Introduction Response:
  "I'm so excited to help you! What do you need assistance with?"
  "Great to hear from you! How can I assist you today?"
  
  ## Purpose Inquiry:
  "Can you explain what specifically you’re struggling with?"
  "What part of this subject would you like to dive into?"
  
  ## Objections Handling:
  If unsure about a specific topic:
  "Which part is giving you trouble? Let's figure it out together."
  "Let’s break it down step-by-step. What seems confusing?"
`
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
