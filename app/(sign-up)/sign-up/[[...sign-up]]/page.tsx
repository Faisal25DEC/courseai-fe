import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      <SignUp
        path="/sign-up"
        forceRedirectUrl={"/"}
        fallbackRedirectUrl={"/"}
      />
    </div>
  );
}
