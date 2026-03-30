"use client";

import { signOut, useSession } from "next-auth/react"; 

export default function StudentDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  console.log(session?.user);

  return (
    <>
      <h1>Welcome, {session?.user?.name || "Student"}</h1>
      <p>Start your learning journey today 🚀</p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </>
  );
}
