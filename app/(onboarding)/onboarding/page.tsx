"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  deleteOnboardingQuestion,
  fetchOnboardingQuestions,
} from "@/services/onboarding.service";
import { useRecoilState } from "recoil";
import { globalEnrolledUsersAtom } from "@/store/atoms";

interface Question {
  id: string;
  heading: string;
  question: string;
  type: string;
  description: string;
}

const Page = () => {
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [heading, setHeading] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSaveQuestion, setisSaveQuestion] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    };
  }, [user]);

  const addQuestion = async () => {
    if (questionText && questionType) {
      const newQuestion = {
        id: Math.random().toString(36).substr(2, 9),
        heading: heading,
        question: questionText,
        type: questionType,
        description: description,
      };

      setisSaveQuestion(true);
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          questions: [newQuestion],
        }),
      });

      if (response.ok) {
        toast.success("Question saved successfully");
        setQuestions([...questions, newQuestion]);
        setHeading("");
        setQuestionText("");
        setQuestionType("");
        setDescription("");
        onOpenChange();
      } else {
        toast.error("Failed to save question");
      }
      setisSaveQuestion(false);
    } else {
      toast.error("All fields are required.");
    }
  };

  const deleteQuestion = async (question_id: any) => {
    try {
      await deleteOnboardingQuestion(user?.id, question_id);
      setQuestions(
        questions.filter((question: any) => question._id !== question_id)
      );
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  return (
    <>
      <div className=" flex flex-col h-[100vh] overflow-auto gap-2 h-full w-[100%] mx-auto">
        <div className=" flex w-[90%]  m-auto justify-between items-center pt-10">
          <div>
            <h1 className="font-normal text-gray-600 text-2xl ">
              Create Onboarding Questions
            </h1>
          </div>
        </div>

        <div className="w-[80%] m-auto flex flex-col gap-4 mt-8 pb-10">
          <div className="flex w-full justify-end">
            <Button onPress={onOpen} color="primary" className="w-fit">
              <Icon icon="ic:twotone-plus" className="text-white w-5 h-5" /> Add
              Question
            </Button>
          </div>
          {questions.map((q: any, index) => (
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
                <p className="text-gray-500 text-sm pr-5">{q.description}</p>
              </div>
              <div>
              <Icon
                icon="fluent:delete-16-filled"
                className="w-5 h-5 text-gray-600 cursor-pointer"
                onClick={() => deleteQuestion(q._id)}
              />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Question
              </ModalHeader>
              <ModalBody>
                <div className="w-full m-auto flex flex-col gap-4">
                  {/* <Input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="Enter heading (Optional)"
                  /> */}
                  <Input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter your question"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (Optional)"
                    rows={4}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  onClick={addQuestion}
                  className="bg-gray-800 text-white"
                >
                  {isSaveQuestion ? (
                    <>
                      <Spinner size="sm" color="white" className="text-white" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Question"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
