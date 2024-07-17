"use client";
import { onBoardingQuestionsAtom } from "@/store/atoms";
import { Input, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useOrganization, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { fetchOnboardingQuestions } from "@/services/onboarding.service";
import withAuth from "@/components/hoc/withAuth";

function Page() {
  const [questions, setQuestions] = useRecoilState<any>(
    onBoardingQuestionsAtom
  );
  const [answers, setAnswers] = useState<
    { question_id: string; answer: any }[]
  >([]);
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!isLoaded || !organization) return;

    const fetchAdminId = async () => {
      try {
        const membershipsResponse = await organization.getMemberships();
        const memberships = membershipsResponse.data;

        const admin = memberships.find((member) => member.role === "org:admin");
        if (admin) {
          await fetchQuestions(admin.publicUserData.userId as string);
        }
      } catch (error) {
      } finally {
      }
    };

    fetchAdminId();
  }, [isLoaded, organization]);

  const fetchQuestions = async (id: string) => {
    try {
      const data = await fetchOnboardingQuestions(id);
      setQuestions(data.data.questions);
    } catch (error) {}
  };

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find(
        (answer) => answer.question_id === questionId
      );
      if (existingAnswer) {
        return prevAnswers.map((answer) =>
          answer.question_id === questionId
            ? { ...answer, answer: value }
            : answer
        );
      } else {
        return [...prevAnswers, { question_id: questionId, answer: value }];
      }
    });
  };

  const handleFileUpload = async (questionId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnswers((prevAnswers) => {
          const existingAnswer = prevAnswers.find(
            (answer) => answer.question_id === questionId
          );
          if (existingAnswer) {
            const updatedAnswers = prevAnswers.map((answer) =>
              answer.question_id === questionId
                ? { ...answer, answer: [...answer.answer, data.url] }
                : answer
            );
            return updatedAnswers;
          } else {
            return [
              ...prevAnswers,
              { question_id: questionId, answer: [data.url] },
            ];
          }
        });
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/save-onboarding-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          answers,
        }),
      });

      if (response.ok) {
        toast.success("Answers saved successfully");
      } else {
        toast.error("Failed to save answers");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const renderInputField = (question: {
    type: string;
    question: string;
    _id: string;
  }) => {
    const answer =
      answers.find((answer) => answer.question_id === question._id)?.answer ||
      "";
    switch (question.type) {
      case "text":
        return (
          <Input
            className="w-full pt-2"
            type="text"
            placeholder={question.question}
            value={answer}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            className="w-ful pt-2"
            type="number"
            placeholder={question.question}
            value={answer}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            className="w-full pt-2"
            type="date"
            placeholder={question.question}
            value={answer}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
          />
        );
      case "upload":
        return (
          <div>
            <input
              className="w-full pt-2 bg-none text-sm"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(question._id, e.target.files[0]);
                }
              }}
            />
            <div className="mt-2 flex">
              {Array.isArray(answer) &&
                answer.map((url, index) => (
                  <div key={index} className="mb-2">
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 absolute left-8 top-5">
        <div className="navbar__logo flex items-center overflow-hidden">
          <img
            src="/images/permian.webp"
            alt="logo"
            className="w-[42px] h-[42px] hidden md:block rounded-full overflow-hidden"
          />
          <p className="flex h-full items-center text-lg ml-1">Permian</p>
        </div>
      </div>
      <div className="flex flex-col justify-center h-[100vh] px-20">
        <h1 className="text-2xl mb-4 text-gray-800 font-semibold">
          Onboarding Questions
        </h1>
        {questions?.length > 0 && (
          <div className="flex flex-col gap-4">
            <div
              key={questions[currentQuestionIndex]._id}
              className="flex flex-col"
            >
              {questions[currentQuestionIndex].heading && (
                <h3 className="text-sm font-semibold">
                  {questions[currentQuestionIndex].heading}
                </h3>
              )}
              <label className="text-sm font-bold text-gray-800">
                {questions[currentQuestionIndex].question}
              </label>
              <small className="text-sm text-gray-600">
                {questions[currentQuestionIndex].description}
              </small>
              {renderInputField(questions[currentQuestionIndex])}
            </div>
            <div className="flex gap-5 mt-10 pr-20">
              <Button
                color="secondary"
                className="w-fit"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
              >
                Back
              </Button>
              <Button
                color="primary"
                className="w-fit"
                onClick={
                  currentQuestionIndex === questions.length - 1
                    ? handleSubmit
                    : handleNext
                }
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default withAuth(Page);
