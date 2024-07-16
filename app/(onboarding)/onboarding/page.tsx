"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  fetchOnboardingAnswers,
  fetchOnboardingQuestions,
} from "@/services/onboarding.service";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  courseIdAtom,
  currentOrganizationIdAtom,
  globalEnrolledUsersAtom,
} from "@/store/atoms";
import { getUserById, updateUserVerifiedStatus } from "@/services/user.service";

interface Question {
  id: string;
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
  const { organization, isLoaded } = useOrganization();
  const currentOrgId = useRecoilValue(currentOrganizationIdAtom);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [heading, setHeading] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [activeButton, setActiveButton] = useState("create");
  const [enrolledUsers, setEnrolledUsers] = useRecoilState(
    globalEnrolledUsersAtom
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSaveQuestion, setisSaveQuestion] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hasVerified, sethasVerified] = useState(false);

  const fetchAnswers = async (userId: string) => {
    try {
      const data = await fetchOnboardingAnswers(userId);
      setAnswers(data.data.answers);
    } catch (error) {
      toast.error("No answers found for the user");
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    if (user) {
      try {
        const data = await fetchOnboardingQuestions(user?.id);
        console.log("fetch questions ", data);
        setQuestions(data.data.questions);
      } catch (error) {
        toast.error("Failed to fetch questions");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();

    return () => {
      setQuestions([]);
      setAnswers([]);
    };
  }, [activeButton, selectedUserId, user]);

  useEffect(() => {
    if (!isLoaded || !organization) return;

    const fetchMembers = async () => {
      try {
        const membershipsResponse = await organization.getMemberships();
        const memberships = membershipsResponse.data.filter(
          (member: any) => member.role !== "org:admin"
        );
        console.log("memberships------------> ", memberships);
        setEnrolledUsers(memberships);
      } catch (error) {
        toast.error("Failed to fetch organization members");
        console.error(error);
      }
    };

    fetchMembers();
  }, [isLoaded, organization]);

  const addQuestion = () => {
    if (questionText && questionType) {
      setQuestions([
        ...questions,
        {
          id: Math.random().toString(36).substr(2, 9),
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
    setisSaveQuestion(true);
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
      setisSaveQuestion(false);
    } else {
      toast.error("Failed to save questions");
    }
  };

  const getQuestionText = (questionId: string) => {
    const question = questions.find((q: any) => q._id === questionId);
    return question ? question.question : "Question not found";
  };

  const handleImageOpenInNewTab = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifyUser = async (
    userId: string,
    orgId: string,
    isVerified: boolean
  ) => {
    setIsVerified(true);
    try {
      const response = await updateUserVerifiedStatus(
        userId,
        orgId,
        isVerified
      );
      toast.success("User verified");
      setIsVerified(false);
    } catch (error) {
      toast.error("Error updating user verified status");
      setIsVerified(false);
    } finally {
      setIsVerified(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(user?.id as any);
      if (userData.data.verified) {
        alert("User verified")
        sethasVerified(true);
      }
    };
    if(user){
      fetchUser();

    }
  }, [user]);

  return (
    <div className="flex flex-col h-[100vh] overflow-auto gap-2 h-full w-[100%] mx-auto">
      <div className=" flex w-[90%] m-auto justify-between items-center pt-10">
        <div>
          <h1 className="font-normal text-gray-600 text-2xl">
            Create Onboarding Questions
          </h1>
        </div>
      </div>
      <div className="w-full flex justify-center gap-5 border-b">
        <button
          className={`text-sm ${
            activeButton === "create" ? "border-b-2 border-black" : ""
          }  pb-2`}
          onClick={() => {
            setActiveButton("create");
            setSelectedUserId(null)
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
          <div className="w-[80%] m-auto flex flex-col gap-4 pt-10">
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

          <div className="w-[80%] m-auto flex flex-col gap-4 mt-8">
            {questions.map((q, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border border-gray-300 rounded-lg"
              >
                <div>
                  <p className="font-bold capitalize">{q.heading}</p>
                  <p className="text-sm">
                    {index + 1}. {q.question}
                  </p>
                  <p className="text-gray-500 capitalize text-sm">{q.type}</p>
                  <p className="text-gray-500 text-sm">{q.description}</p>
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
            <div className="w-[80%] m-auto mt-8 mb-8">
              <Button
                onClick={handleSubmit}
                className="bg-green-500 text-white"
              >
                {isSaveQuestion ? (
                  <>
                    {" "}
                    <Spinner
                      size="sm"
                      color="white"
                      className="text-white"
                    />{" "}
                    Saving...
                  </>
                ) : (
                  "Save Questions"
                )}
              </Button>
            </div>
          )}
        </>
      )}
      {activeButton === "view" && selectedUserId === null && (
        <div className="w-[100%] flex items-center h-[100vh] flex-col gap-4 mt-20">
          {enrolledUsers?.map((user: any, ind: number) => {
            return (
              <div
                onClick={() => {
                  setSelectedUserId(user.publicUserData.userId);
                  fetchAnswers(user.publicUserData.userId);
                }}
                key={user.userId}
                className="p-4 w-[80%] shadow-1 cursor-pointer flex justify-between items-center rounded-md"
              >
                <div className="w-[100%] flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={user.publicUserData.imageUrl}
                      alt="avatar"
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                  </div>
                  <div className="text-gray-700 font-medium">
                    {user.publicUserData.firstName}{" "}
                    {user.publicUserData.lastName}
                  </div>
                </div>
                <div>
                  <p className="text-[12px]">
                    {user.publicUserData.identifier}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {activeButton === "view" && selectedUserId !== null && (
        <div className="w-[80%] m-auto flex flex-col gap-4 mt-8">
          {answers.map((answer, index) => {
            const questionText = getQuestionText(answer.question_id);
            const question = questions.find(
              (q: any) => q._id === answer.question_id
            );

            return (
              <div
                key={index}
                className="shadow-sm flex flex-col p-2 border border-gray-300 rounded-lg"
              >
                <p className="font-semibold text-sm text-gray-800">
                  {index + 1}: {questionText}
                </p>
                {question &&
                question.type === "upload" &&
                Array.isArray(answer.answer) ? (
                  <div className="flex flex-wrap gap-5 mt-2">
                    {answer.answer.map((imageUrl, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={imageUrl}
                        alt={`Answer Image ${imgIndex + 1}`}
                        className="w-[220px] h-[200px] object-cover border-1 p-2 rounded-md cursor-pointer"
                        onClick={() => handleImageOpenInNewTab(imageUrl)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{answer.answer}</p>
                )}
              </div>
            );
          })}

          <div className="flex w-full justify-end gap-4 mt-5">
            <Button
              color="secondary"
              onClick={() => setSelectedUserId(null)}
              className="mb-4 w-fit"
            >
              Back to Users
            </Button>
            <Button
              color="primary"
              onClick={() => verifyUser(selectedUserId, currentOrgId, true)}
              className="mb-4 w-fit"
            >
              {isVerified ? (
                <>
                  {" "}
                  <Spinner size="sm" color="white" className="" />
                  Verifying...{" "}
                </>
              ) : hasVerified ? (
                "Verified"
              ) : (
                "Verify User"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
