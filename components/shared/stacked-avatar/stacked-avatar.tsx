import React from "react";

const StackedAvatar = ({ images }: { images: string[] }) => {
  if (images?.length === 0) return <p className="h3-medium">0</p>;
  return (
    <div className="w-[fit-content]">
      <div className="flex gap-[-20px]">
        {images?.slice(0, 2)?.map((image, index) => (
          <div
            key={index}
            className="rounded-full border-2 border-white"
            style={{
              zIndex: index,
              transform: `translateX(${index * -10}px)`,
            }}
          >
            <img src={image} className="rounded-full w-10 h-10" alt="avatar" />
          </div>
        ))}
        {images?.length > 3 && (
          <div
            className="rounded-full border-2 bg-pink-100 border-white"
            style={{
              zIndex: 3,
              transform: `translateX(${3 * -10}px)`,
            }}
          >
            <div className="w-10 h-10 text-[13px] text-gray-600 rounded-full flex justify-center items-center">
              +{images?.length - 3}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackedAvatar;
