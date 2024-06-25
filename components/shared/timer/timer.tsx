"use client";
import { StringFormats } from "@/lib/StringFormats";
import React, { useState, useEffect } from "react";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setPercentage(((timeLeft - 1) / 60) * 100);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  return (
    <div className=" w-[150px] max-w-md mx-auto rounded-[10px]">
      <div className="w-full flex relative justify-center items-center bg-gray-200  h-6 rounded-[5px]">
        <div
          className="bg-[rgba(152,131,255,0.31)] absolute left-0 top-[50%] translate-y-[-50%] rounded-[5px] flex justify-center items-center h-[95%]"
          style={{ width: `${100 - percentage}%` }}
        ></div>
        <div className="text-gray-700 text-[12px]">
          {StringFormats.formatIntoTimeString(60 - timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default Timer;
