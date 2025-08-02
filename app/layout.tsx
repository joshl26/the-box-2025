"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveClock from "./components/Clock";

interface Tab {
  id: string;
  label: string;
  href: string;
}

const tabs: Tab[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "grows", label: "Grows", href: "/dashboard/grows" },

  {
    id: "irrigationSchedule",
    label: "Irrigation Schedule",
    href: "/dashboard/irrigationSchedule",
  },
  {
    id: "profileSettings",
    label: "Profile Settings",
    href: "/dashboard/profileSettings",
  },
  {
    id: "logout",
    label: "Logout",
    href: "/",
  },
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <>
      {pathname === "/" ? (
        ""
      ) : (
        <div className="flex justify-between">
          <nav className="flex space-x-4 border-b pb-6 mb-4">
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
          </nav>
          <LiveClock />
        </div>
      )}
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased container m-auto py-10`}
        >
          {children}
        </body>
      </html>
    </>
  );
}
