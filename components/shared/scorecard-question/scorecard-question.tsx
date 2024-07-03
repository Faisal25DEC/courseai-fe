import { getScorecardQuestions } from "@/services/scorecard.service";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

function ScoreCardQuestions() {
  const user = useUser();
  const [questions, setQuestions] = useState([]);

  const fetchScorecardQuestions = async (id: any) => {
    const res = await getScorecardQuestions(id);
    setQuestions(res.questions);
  };

  useEffect(() => {
    const _id = user?.user?.id;
    fetchScorecardQuestions(_id);
  }, [user]);

  return (
    <div className="w-[100%] p-5 h-[80vh] overflow-auto">
      <h1 className="text-md  font-semibold pb-3">Scorecard Questions</h1>
      <div className="flex flex-col">
        {questions.map((qs: any) => {
          return (
            <div className="w-[500px] border-2 rounded-lg p-3 capitalize flex justify-between items-center mb-4">
              {qs.question_text}
              <Icon
                icon="fluent:delete-24-regular"
                className="text-[#F31260] w-4 h-4 cursor-pointer"
              />
            </div>
          );
        })}

        <div className="flex justify-center absolute bottom-6 right-6">
          <Button className="bg-gray-800 text-white">Add Question</Button>
        </div>
      </div>
    </div>
  );
}

export default ScoreCardQuestions;
