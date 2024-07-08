import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-8 bg-gray-100">{children}</div>;
};

export default layout;
