import { atom } from "recoil";

export const createLessonModalAtom = atom({
  key: "createLessonModalAtom",
  default: false,
});

interface LessonInterface {
  id?: any;
  title: string;
  type: string;
  description: string;
  content: any;
  submission: string;
  submission_status: string;
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

export const currentCourseAtom = atom({
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

export const lessonModalTypeAtom = atom<LessonModalTypeInterface | null>({
  key: "lessonModalTypeAtom",
  default: null,
});

export const activeLessonAtom = atom<any>({
  key: "activeLessonAtom",
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
