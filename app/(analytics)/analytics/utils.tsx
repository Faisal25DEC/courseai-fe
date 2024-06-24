export const getCourseProgress = (userAnalytics: any, lessonsArray: any) => {
  let completedLessons = 0;
  lessonsArray.forEach((lesson: any) => {
    if (userAnalytics?.analytics[lesson.id]?.status === "approved") {
      completedLessons += 1;
    }
  });

  return Math.round((completedLessons / lessonsArray.length) * 100);
};
