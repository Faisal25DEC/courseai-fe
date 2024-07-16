"use client";

import { useUser } from "@clerk/nextjs";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fetchOnboardingAnswers } from "@/services/onboarding.service";

interface Question {
  heading: string;
  question: string;
  type: string;
  description: string;
}

interface Answer {
  question_id: string;
  answer: any;
}

const Page = () => {
  const { user } = useUser();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [heading, setHeading] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [activeButton, setActiveButton] = useState("create");

  useEffect(() => {
    if (activeButton === "view" && user?.id) {
      fetchAnswers(user.id);
    }
  }, [activeButton, user?.id]);

  const fetchAnswers = async (userId: string) => {
    try {
      const data = await fetchOnboardingAnswers(userId);
      setAnswers(data.data.answers);
    } catch (error) {
      toast.error("Failed to fetch answers");
    }
  };

  const addQuestion = () => {
    if (questionText && questionType) {
      setQuestions([
        ...questions,
        {
          heading: heading,
          question: questionText,
          type: questionType,
          description: description,
        },
      ]);
      setHeading("");
      setQuestionText("");
      setQuestionType("");
      setDescription("");
    } else {
      toast.error("All fields are required.");
    }
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
        questions,
      }),
    });

    if (response.ok) {
      toast.success("Questions saved successfully");
    } else {
      toast.error("Failed to save questions");
    }
  };

  const getAnswerForQuestion = (questionId: string) => {
    const answer = answers.find((ans) => ans.question_id === questionId);
    return answer ? answer.answer : "No answer provided";
  };

  return (
    <div className="flex flex-col h-[100vh] overflow-auto gap-2 h-full w-[100%] mx-auto">
      <div className="flex w-[90%] m-auto justify-between items-center py-8">
        <div>
          <h1 className="font-normal text-gray-600 text-2xl">
            Create Onboarding Questions
          </h1>
        </div>
      </div>

      <hr className="bg-gray-600 w-full" />
      <div className="w-full flex justify-center gap-5 border-b">
        <button
          className={`text-sm ${
            activeButton === "create" ? "border-b-2 border-black" : ""
          }  pb-2`}
          onClick={() => {
            setActiveButton("create");
          }}
        >
          Create
        </button>
        <button
          className={`text-sm ${
            activeButton === "view" ? "border-b-2 border-black" : ""
          }  pb-2`}
          onClick={() => {
            setActiveButton("view");
          }}
        >
          View
        </button>
      </div>
      {activeButton === "create" && (
        <>
          <div className="w-[50%] m-auto flex flex-col gap-4 pt-10">
            <Input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter heading (Optional)"
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (Optional)"
              rows={4}
            />
            <Input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question"
            />
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select question type</option>
              <option value="text">Text</option>
              <option value="date">Date</option>
              <option value="number">Number</option>
              <option value="upload">Upload</option>
            </select>
            <Button onClick={addQuestion} color="primary" className="w-fit">
              Add Question
            </Button>
          </div>

          <div className="w-[50%] m-auto flex flex-col gap-4 mt-8">
            {questions.map((q, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border border-gray-300 rounded-lg"
              >
                <div>
                  <p className="font-bold">{q.heading}</p>
                  <p>
                    {index + 1}. {q.question}
                  </p>
                  <p className="text-gray-500">{q.type}</p>
                  <p className="text-gray-500">{q.description}</p>
                </div>
                <Icon
                  icon="fluent:delete-16-filled"
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={() => deleteQuestion(index)}
                />
              </div>
            ))}
          </div>

          {questions.length > 0 && (
            <div className="w-[50%] m-auto mt-8">
              <Button
                onClick={handleSubmit}
                className="bg-green-500 text-white"
              >
                Save Questions
              </Button>
            </div>
          )}
        </>
      )}
      {activeButton === "view" && (
        <div className="w-[50%] m-auto flex flex-col gap-4 mt-8">
          {questions.map((q:any, index) => (
            <div
              key={index}
              className="flex flex-col p-2 border border-gray-300 rounded-lg"
            >
              <div>
                <p className="font-bold">{q.heading}</p>
                <p>
                  {index + 1}. {q.question}
                </p>
                <p className="text-gray-500">{q.type}</p>
                <p className="text-gray-500">{q.description}</p>
                <p className="font-semibold">Answer: {getAnswerForQuestion(q.question.id)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
