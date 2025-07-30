"use client"; // This component will be a Client Component

// import { useState } from "react";
// import Link from "next/link";
import { usePathname } from "next/navigation";

// interface Tab {
//   id: string;
//   label: string;
//   href: string;
// }

// const tabs: Tab[] = [
//   { id: "dashboard", label: "Dashboard", href: "/dashboard" },
//   {
//     id: "irrigationSchedule",
//     label: "Irrigation Schedule",
//     href: "/dashboard/irrigationSchedule",
//   },
//   { id: "profile", label: "Profile", href: "/dashboard/profile" },
// ];

export default function DashboardPage() {
  const pathname = usePathname();

  return (
    <div>
      {/* <nav className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <span
              className={`py-2 px-4 cursor-pointer ${
                pathname === tab.href
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : ""
              }`}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </nav> */}

      <div className="mt-4">
        {/* The content for the active tab will be rendered by Next.js based on the URL */}
        {/* You can add a fallback or default content here if needed */}
        {pathname === "/dashboard" && <p>Select a tab to view content.</p>}
      </div>
    </div>
  );
}
