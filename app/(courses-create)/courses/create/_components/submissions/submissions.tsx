import { lessonAtom } from "@/store/atoms";
import React from "react";
import { useRecoilState } from "recoil";

const Submissions = () => {
  const [currentLesson, setCurrentLesson] = useRecoilState(lessonAtom);
  const submissionButtons = [
    {
      label: "Manual",
      value: "mannual",
    },
    {
      label: "Automatic",
      value: "automatic",
    },
  ];
  const handleChangeType = (value: string) => {
    setCurrentLesson({ ...currentLesson, submission: value });
  };
  return (
    <div className="">
      <div className="label-container">
        <label className="label">Select Submission Type</label>
        <div className="flex items-center gap-2 flex-wrap">
          {submissionButtons.map((button, idx) => (
            <div key={idx} onClick={() => handleChangeType(button.value)}>
              <div
                className={`w-[150px] cursor-pointer h-[120px] relative rounded-[12px] ${
                  currentLesson.submission === button.value
                    ? "bg-blue-200"
                    : "bg-blue-50"
                }`}
              >
                <div className="absolute bottom-3 left-[10%] text-sm">
                  {button.label}
                </div>
                <div
                  className={`absolute top-3 left-3 h-3 w-3 rounded-full border-blue-500 border ${
                    currentLesson.submission === button.value
                      ? "bg-blue-100"
                      : "bg-transparent"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
