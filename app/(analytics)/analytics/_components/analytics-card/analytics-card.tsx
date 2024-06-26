import StackedAvatar from "@/components/shared/stacked-avatar/stacked-avatar";
import React from "react";

interface AnalyticsCardProps {
  card: {
    title: string;
    value: number | string;
    icon?: JSX.Element;
    usersImageUrl?: any;
  };
}

const AnalyticsCard = ({ card }: AnalyticsCardProps) => {
  return (
    <div className="p-4 rounded-[12px] border border-gray-200 shadow-1 flex-1 h-[130px] bg-white">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* <div className="flex items-center gap-2">{card.icon}</div> */}
          <h1 className="h4-medium">{card.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {card.usersImageUrl?.length > 0 && (
            <StackedAvatar
              images={card.usersImageUrl.map((item: any) => item.imageUrl)}
            />
          )}
          {!card.usersImageUrl && <p className="h3-medium">{card.value}</p>}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
