import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="flex-col">
        <h1 className="text-4xl">Welcome to The Box 2025</h1>
        <div className="justify-center p-6 flex">
          <Link
            className="bg-white p-2 text-black rounded hover:border-white hover:border hover:font-bold hover:bg-black hover:text-white"
            href="/dashboard"
          >
            Click Here to Enter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
