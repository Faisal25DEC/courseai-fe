import { FormatDate } from "@/lib/DateHelpers/DateHelpers";

export const getCourseProgress = (userAnalytics: any, lessonsArray: any) => {
  let completedLessons = 0;
  lessonsArray.forEach((lesson: any) => {
    if (userAnalytics?.analytics[lesson.id]?.status === "approved") {
      completedLessons += 1;
    }
  });

  return Math.round((completedLessons / lessonsArray.length) * 100);
};
export const getTotalTime = (analytics: any) => {
  let totalTime = 0;
  Object.keys(analytics?.analytics).forEach((key) => {
    totalTime += analytics?.analytics[key]?.duration;
  });
  console.log(analytics?.analytics, totalTime, "totalTime");
  return totalTime;
};

export const getAverageTraningTime = (
  enrolledUsers: any,
  lessonsArray: any
) => {
  let time = 0;
  lessonsArray.forEach((lesson: any) => {
    if (lesson.type !== "avatar") return;
    enrolledUsers.forEach((user: any) => {
      time += user.analytics?.analytics[lesson.id]?.duration || 0;
    });
  });
  return FormatDate.formatMilliseconds(time / enrolledUsers.length);
};
