import { lessonAtom, lessonCreateStepsAtom } from "@/store/atoms";
import {
  decrementLessonCreateStepSelector,
  incrementLessonCreateStepSelector,
} from "@/store/selectors";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import VideoContent from "../video-content/video-content";
import TextContent from "../text-content/text-content";
import AvatarContent from "../avatar-content/avatar-content";

const CreateContent = () => {
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const [lessonCreateSteps, setLessonCreateSteps] = useRecoilState(
    lessonCreateStepsAtom
  );
  const incrementStep = useSetRecoilState(incrementLessonCreateStepSelector);
  const decrementStep = useSetRecoilState(decrementLessonCreateStepSelector);
  return (
    <div>
      {currentLesson.type === "video" && <VideoContent />}
      {currentLesson.type === "text" && <TextContent />}
      {currentLesson.type === "avatar" && <AvatarContent />}
    </div>
  );
};

export default CreateContent;
