import { atom } from "recoil";

export const createLessonModalAtom = atom({
  key: "createLessonModalAtom",
  default: false,
});

interface LessonInterface {
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
