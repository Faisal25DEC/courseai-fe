"use client";

import { SignIn, useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { useEffect } from "react";

const Page = () => {
  // const { signUp } = useSignUp();
  // const { signIn } = useSignIn();

  // // Get the token from the query parameter
  // const param = "__clerk_ticket";
  // const status = "__clerk_status";
  // const ticket = new URL(window.location.href).searchParams.get(param);
  // const statusParam = new URL(window.location.href).searchParams.get(status);

  // const createSignIn = async () => {
  //   if (!signIn || !ticket) return;
  //   await signIn.create({
  //     strategy: "ticket",
  //     ticket,
  //   });
  // };

  // const createSignUp = async () => {
  //   if (!signUp || !ticket) return;
  //   await signUp.create({
  //     strategy: "ticket",
  //     ticket,
  //   });
  // };

  // if (statusParam === "sign-in") {
  //   createSignIn();
  // }
  // if (statusParam === "sign-up") {
  //   createSignUp();
  // }

  const { isSignedIn } = useAuth();
  useEffect(() => {
    if (isSignedIn) {
      window.location.href = "/";
    }
  }, [isSignedIn]);
  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.03)] flex items-center justify-center">
      <SignIn
        path="/sign-in"
        afterSignOutUrl={"/sign-in"}
        forceRedirectUrl={"/"}
        fallbackRedirectUrl={"/"}
      />
    </div>
  );
};

export default Page;
