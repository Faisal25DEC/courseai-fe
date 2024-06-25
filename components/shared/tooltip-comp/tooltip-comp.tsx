import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipComp = ({
  trigger,
  value,
}: {
  trigger: React.ReactNode;
  value: React.ReactNode;
}) => (
  <TooltipProvider delayDuration={50}>
    <Tooltip>
      <TooltipTrigger className="" asChild>
        <div className="cursor-pointer">{trigger}</div>
      </TooltipTrigger>
      <TooltipContent className="py-1 px-2">
        <div className="cursor-pointer text-[12px] text-gray-600">{value}</div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default TooltipComp;
