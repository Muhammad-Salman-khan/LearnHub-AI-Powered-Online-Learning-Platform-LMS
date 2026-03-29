"use client";
import { signIn } from "next-auth/react";
const page = () => {
  return (
    <div>
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Sign Up with google
      </button>
    </div>
  );
};

export default page;
