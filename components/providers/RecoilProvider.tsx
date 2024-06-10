"use client";
import React from "react";
import { RecoilRoot } from "recoil";

const RecoilProvider = ({ children }: { children: any }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default RecoilProvider;
