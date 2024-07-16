"use client";
import { onBoardingQuestionsAtom } from "@/store/atoms";
import { Input, Button } from "@nextui-org/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function Page() {
  const [questions] = useRecoilState<any>(onBoardingQuestionsAtom);
  const [answers, setAnswers] = useState<{ question_id: string, answer: any }[]>([]);
  const { user } = useUser();

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find(answer => answer.question_id === questionId);
      if (existingAnswer) {
        return prevAnswers.map(answer =>
          answer.question_id === questionId ? { ...answer, answer: value } : answer
        );
      } else {
        return [...prevAnswers, { question_id: questionId, answer: value }];
      }
    });
  };

  const handleFileUpload = async (questionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnswers((prevAnswers) => {
          const existingAnswer = prevAnswers.find(answer => answer.question_id === questionId);
          if (existingAnswer) {
            const updatedAnswers = prevAnswers.map(answer =>
              answer.question_id === questionId
                ? { ...answer, answer: [...answer.answer, data.url] }
                : answer
            );
            return updatedAnswers;
          } else {
            return [...prevAnswers, { question_id: questionId, answer: [data.url] }];
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
      const response = await fetch('/api/save-onboarding-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    const answer = answers.find(answer => answer.question_id === question._id)?.answer || "";
    switch (question.type) {
      case "text":
        return (
          <Input
            className="w-fit pt-2"
            type="text"
            placeholder={question.question}
            value={answer}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            className="w-fit pt-2"
            type="number"
            placeholder={question.question}
            value={answer}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            className="w-fit pt-2"
            type="date"
            placeholder={question.question}
            value={answer}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
          />
        );
      case "upload":
        return (
          <div>
            <Input
              className="w-fit pt-2"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(question._id, e.target.files[0]);
                }
              }}
            />
            <div>
              {Array.isArray(answer) && answer.map((url, index) => (
                <div key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  console.log(answers)
  return (
    <div className="py-20 px-20">
      <h1 className="text-2xl mb-4 text-gray-800 font-semibold">
        Onboarding Questions
      </h1>
      <div className="flex flex-col gap-4">
        {questions.map((question: any) => (
          <div key={question._id} className="flex flex-col">
            {question.heading && (
              <h3 className="text-sm font-semibold">{question.heading}</h3>
            )}
            <label className="text-sm font-bold text-gray-800">
              {question.question}
            </label>
            <small className="text-sm text-gray-600">
              {question.description}
            </small>
            {renderInputField(question)}
          </div>
        ))}
        <Button color="primary" onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export default Page;
