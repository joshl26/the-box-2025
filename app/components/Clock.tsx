"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface LiveClockProps {
  format?: "12" | "24";
  showSeconds?: boolean;
  showDate?: boolean;
  showTimezone?: boolean;
  timezone?: string;
  className?: string;
}

export default function LiveClock({
  format = "12",
  showSeconds = true,
  showDate = true,
  showTimezone = false,
  timezone,
  className = "",
}: LiveClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by only showing time after component mounts
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  // Don't render anything until component is mounted (prevents hydration mismatch)
  if (!mounted || !time) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <Clock className="h-5 w-5 text-gray-400" />
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  // Format time based on timezone if provided
  const displayTime = timezone
    ? new Date(time.toLocaleString("en-US", { timeZone: timezone }))
    : time;

  // Format time string
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      ...(showSeconds && { second: "2-digit" }),
      hour12: format === "12",
      ...(timezone && { timeZone: timezone }),
    };
    return date.toLocaleTimeString([], options);
  };

  // Format date string
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(timezone && { timeZone: timezone }),
    };
    return date.toLocaleDateString([], options);
  };

  // Get timezone display name
  const getTimezoneDisplay = (date: Date) => {
    if (!timezone)
      return date
        .toLocaleTimeString([], { timeZoneName: "short" })
        .split(" ")
        .pop();

    try {
      return date
        .toLocaleTimeString([], {
          timeZone: timezone,
          timeZoneName: "short",
        })
        .split(" ")
        .pop();
    } catch {
      return timezone;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-3 ${className}`}>
      <Clock className="h-5 w-5 " />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-mono font-semibold  tracking-wider">
            {formatTime(displayTime)}
          </span>
          {showTimezone && (
            <span className="text-sm  font-medium">
              {getTimezoneDisplay(displayTime)}
            </span>
          )}
        </div>
        {showDate && (
          <span className="text-sm mt-1">{formatDate(displayTime)}</span>
        )}
      </div>
    </div>
  );
}

// Different clock variations
export function DigitalClock({ className = "" }: { className?: string }) {
  return (
    <LiveClock
      format="24"
      showSeconds={true}
      showDate={false}
      className={`bg-black text-green-400 p-4 rounded-lg font-mono text-3xl ${className}`}
    />
  );
}

export function AnalogStyleClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  if (!mounted || !time) {
    return (
      <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  return (
    <div className={`relative w-32 h-32 ${className}`}>
      <div className="w-full h-full bg-white border-4 border-gray-800 rounded-full relative">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-6 bg-gray-800"
            style={{
              top: "8px",
              left: "50%",
              transformOrigin: "50% 56px",
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 bg-gray-800 origin-bottom z-20"
          style={{
            height: "32px",
            marginTop: "-32px",
            marginLeft: "-2px",
            transform: `rotate(${hourAngle}deg)`,
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 bg-gray-700 origin-bottom z-30"
          style={{
            height: "44px",
            marginTop: "-44px",
            marginLeft: "-1px",
            transform: `rotate(${minuteAngle}deg)`,
          }}
        />

        {/* Second hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 bg-red-500 origin-bottom z-40"
          style={{
            height: "48px",
            marginTop: "-48px",
            marginLeft: "-1px",
            transform: `rotate(${secondAngle}deg)`,
          }}
        />
      </div>
    </div>
  );
}

// World Clock Component
export function WorldClock({ className = "" }: { className?: string }) {
  const timezones = [
    { name: "New York", timezone: "America/New_York" },
    { name: "London", timezone: "Europe/London" },
    { name: "Tokyo", timezone: "Asia/Tokyo" },
    { name: "Sydney", timezone: "Australia/Sydney" },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {timezones.map((tz) => (
        <div key={tz.timezone} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {tz.name}
          </h3>
          <LiveClock
            format="12"
            showSeconds={false}
            showDate={false}
            showTimezone={true}
            timezone={tz.timezone}
          />
        </div>
      ))}
    </div>
  );
}

// Example usage component
export function ClockExamples() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Live Clock Components
      </h1>

      {/* Standard Clock */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Standard Clock</h2>
        <LiveClock />
      </div>

      {/* 24-hour format without date */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">24-Hour Format</h2>
        <LiveClock format="24" showDate={false} showTimezone={true} />
      </div>

      {/* Digital Clock Style */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Digital Clock Style</h2>
        <DigitalClock />
      </div>

      {/* Analog Clock */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Analog Clock</h2>
        <AnalogStyleClock />
      </div>

      {/* World Clock */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">World Clock</h2>
        <WorldClock />
      </div>
    </div>
  );
}
