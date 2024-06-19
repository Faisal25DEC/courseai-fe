import React from "react";

interface AnalyticsCardProps {
  card: {
    title: string;
    value: number | string;
    icon: JSX.Element;
  };
}

const AnalyticsCard = ({ card }: AnalyticsCardProps) => {
  return (
    <div className="p-4 rounded-[12px] border border-gray-200 shadow-1 flex-1 h-[120px] bg-white">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* <div className="flex items-center gap-2">{card.icon}</div> */}
          <h1 className="h4-medium">{card.title}</h1>
        </div>
        <p className="h2-medium">{card.value}</p>
      </div>
    </div>
  );
};

export default AnalyticsCard;
