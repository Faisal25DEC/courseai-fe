import { selector } from "recoil";
import { lessonCreateStepsAtom } from "../atoms";

// Define the selector to increase the step
export const incrementLessonCreateStepSelector = selector({
  key: "incrementLessonCreateStepSelector",
  get: ({ get }) => {
    const currentStep = get(lessonCreateStepsAtom);
    return currentStep;
  },
  set: ({ set }) => {
    set(lessonCreateStepsAtom, (currentStep) => currentStep + 1);
  },
});

// Define the selector to decrease the step
export const decrementLessonCreateStepSelector = selector({
  key: "decrementLessonCreateStepSelector",
  get: ({ get }) => {
    const currentStep = get(lessonCreateStepsAtom);
    return currentStep;
  },
  set: ({ set }) => {
    set(lessonCreateStepsAtom, (currentStep) =>
      currentStep > 1 ? currentStep - 1 : currentStep
    );
  },
});
