import { analyticsTabsValues } from "@/lib/constants";
import { atom } from "recoil";

export const createLessonModalAtom = atom({
  key: "createLessonModalAtom",
  default: false,
});

export const createPracticeLessonModalAtom = atom({
  key: "createPracticeLessonModalAtom",
  default: false,
});

export const createCourseModalAtom = atom({
  key: "createCourseModalAtom",
  default: false,
});

export const courseIdAtom = atom({
  key: "courseIdAtom",
  default: process.env.NEXT_PUBLIC_CURRENT_COURSE_ID as string,
});

export const scorecardQueAtom = atom({
  key: "scorecardQueAtom",
  default: [],
});
interface LessonInterface {
  id?: any;
  title: string;
  type: string;
  description: string;
  content: any;
  submission: string;
  submission_status: string;
  is_practice_lesson: boolean;
  scorecard_questions: Array<string>;
}

export const lessonAtom = atom<LessonInterface>({
  key: "lessonAtom",
  default: {
    id: null,
    title: "",
    description: "",
    type: "",
    content: null,
    submission: "",
    submission_status: "",
    is_practice_lesson: false,
    scorecard_questions: [],
  },
});

export const lessonCreateStepsAtom = atom({
  key: "lessonCreateStepsAtom",
  default: 1,
});
export const avatarsAtom = atom({
  key: "avatarsAtom",
  default: [],
});

export const voicesAtom = atom({
  key: "voicesAtom",
  default: [],
});

export const courseNameAtom = atom<any>({
  key: "courseNameAtom",
  default: "",
});

export const currentCourseAtom = atom<any>({
  key: "currentCourseAtom",
  default: {},
});
export const lessonsArrayAtom = atom({
  key: "lessonsArrayAtom",
  default: [],
});

export const editLessonModalAtom = atom({
  key: "editLessonModalAtom",
  default: false,
});

interface LessonModalTypeInterface {
  type: string;
  lesson: LessonInterface;
}

interface LessonModalTypeInterface {
  type: string;
  lesson: LessonInterface;
}

export const lessonModalTypeAtom = atom<LessonModalTypeInterface | null>({
  key: "lessonModalTypeAtom",
  default: null,
});

export const courseModalTypeAtom = atom<any>({
  key: "courseModalTypeAtom",
  default: null,
});

export const activeLessonAtom = atom<any>({
  key: "activeLessonAtom",
  default: 0,
});

export const randomNumberAtom = atom<any>({
  key: "randomNumberAtom",
  default: 0,
});

export const noOrgnizationModalAtom = atom({
  key: "noOrgnizationModalAtom",
  default: false,
});

export const currentUserRoleAtom = atom({
  key: "currentUserRoleAtom",
  default: "",
});
export const lessonLockedModalAtom = atom({
  key: "lessonLockedModalAtom",
  default: false,
});
export const currentUserAnalyticsModalAtom = atom({
  key: "currentUserAnalyticsModalAtom",
  default: false,
});
export const userAnalyticsAtom = atom<any>({
  key: "userAnalyticsAtom",
  default: null,
});

export const currentUserLessonAnalyticsAtom = atom<any>({
  key: "currentUserLessonAnalyticsAtom",
  default: null,
});

export const enrollCourseModalAtom = atom({
  key: "enrollCourseModalAtom",
  default: false,
});

export const organizationMembersAtom = atom<any>({
  key: "organizationMembersAtom",
  default: null,
});

export const globalEnrolledUsersAtom = atom<any>({
  key: "globalEnrolledUsersAtom",
  default: [],
});
export const currentAvatarConversationAtom = atom<any>({
  key: "currentAvatarConversationAtom",
  default: null,
});

export const analyticsTabValueAtom = atom({
  key: "analyticsTabValueAtom",
  default: analyticsTabsValues.analytics,
});

export const infoModalAtom = atom({
  key: "infoModalAtom",
  default: "",
});
export const endCallModalAtom = atom({
  key: "endCallModalAtom",
  default: false,
});
export const startCallModalAtom = atom({
  key: "startCallModalAtom",
  default: false,
});
export const currentOrganizationIdAtom = atom<any>({
  key: "currentOrganizationIdAtom",
  default: "",
});
export const userTranscriptLoadingAtom = atom({
  key: "userTranscriptLoadingAtom",
  default: 0,
});

export const responseLoadingAtom = atom({
  key: "responseLoadingAtom",
  default: false,
});
