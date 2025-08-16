"use client";

import React, { useState, useEffect } from "react";
import { Play, Unplug, Zap, RefreshCw } from "lucide-react";

// Types
interface SerialPort {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

interface PumpCommand {
  action: "pump";
  pin: number;
  duration: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

interface PortsResponse extends ApiResponse {
  ports?: SerialPort[];
}

interface SerialControllerProps {
  defaultDuration?: number;
  defaultBaudRate?: number;
  pin?: number;
}

// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error occurred";
};

const SerialPumpController: React.FC<SerialControllerProps> = ({
  defaultDuration = 30,
  defaultBaudRate = 115200,
  pin = 22,
}) => {
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Disconnected");
  const [availablePorts, setAvailablePorts] = useState<SerialPort[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Check connection status
  const checkStatus = async (): Promise<void> => {
    try {
      const response = await fetch("/api/serial/status", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error: unknown) {
      console.error("Status check failed:", getErrorMessage(error));
      setIsConnected(false);
    }
  };

  // Get available serial ports
  const refreshPorts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/serial/ports", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PortsResponse = await response.json();

      if (data.success && data.ports) {
        setAvailablePorts(data.ports);
        setStatus(`Found ${data.ports.length} port(s)`);
      } else {
        setStatus(`Error: ${data.error || "Unknown error"}`);
        setAvailablePorts([]);
      }
    } catch (error: unknown) {
      setStatus(`Failed to fetch ports: ${getErrorMessage(error)}`);
      setAvailablePorts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to serial port
  const connectSerial = async (): Promise<void> => {
    if (!selectedPort) {
      setStatus("Please select a port first");
      return;
    }

    try {
      const response = await fetch("/api/serial/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          port: selectedPort,
          baudRate: defaultBaudRate,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setIsConnected(true);
        setStatus(`Connected to ${selectedPort} at ${defaultBaudRate} baud`);
      } else {
        setStatus(`Connection failed: ${data.error || "Unknown error"}`);
      }
    } catch (error: unknown) {
      setStatus(`Connection failed: ${getErrorMessage(error)}`);
    }
  };

  // Disconnect from serial port
  const disconnectSerial = async (): Promise<void> => {
    try {
      const response = await fetch("/api/serial/disconnect", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setIsConnected(false);
        setStatus("Disconnected");
      } else {
        setStatus(`Disconnect failed: ${data.error || "Unknown error"}`);
      }
    } catch (error: unknown) {
      setStatus(`Disconnect failed: ${getErrorMessage(error)}`);
    }
  };

  // Send pump command
  const sendCommand = async (): Promise<void> => {
    if (!isConnected) {
      setStatus("Not connected to serial port");
      return;
    }

    setIsSending(true);
    try {
      const command: PumpCommand = {
        action: "pump",
        pin: pin,
        duration: duration,
      };

      const response = await fetch("/api/serial/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setStatus(`✅ Sent: ${JSON.stringify(command)}`);
      } else {
        setStatus(`Send failed: ${data.error || "Unknown error"}`);
      }
    } catch (error: unknown) {
      setStatus(`Send failed: ${getErrorMessage(error)}`);
    } finally {
      setIsSending(false);
    }
  };

  const adjustDuration = (increment: number): void => {
    setDuration((prev) => Math.max(1, prev + increment));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value) || 1;
    setDuration(Math.max(1, value));
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedPort(e.target.value);
  };

  // Load ports and check status on component mount
  useEffect(() => {
    refreshPorts();
    checkStatus();
  }, []);

  const currentCommand: PumpCommand = {
    action: "pump",
    pin: pin,
    duration: duration,
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Serial Pump Controller
        </h2>
        <p className="text-sm text-gray-600">
          Next.js App Router + TypeScript + SerialPort
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-3 rounded-md bg-gray-50 border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          ></div>
        </div>
        <p className="text-xs text-gray-600 break-words font-mono">{status}</p>
      </div>

      {/* Port Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="port-select"
            className="text-sm font-medium text-gray-700"
          >
            Serial Port ({availablePorts.length} available):
          </label>
          <button
            onClick={refreshPorts}
            disabled={isLoading || isConnected}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-400 transition-colors"
            aria-label="Refresh ports"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        <select
          id="port-select"
          value={selectedPort}
          onChange={handlePortChange}
          disabled={isConnected}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
        >
          <option value="">
            {isLoading ? "Loading ports..." : "Select a port..."}
          </option>
          {availablePorts.map((port) => (
            <option key={port.path} value={port.path}>
              {port.path} {port.manufacturer && `(${port.manufacturer})`}
            </option>
          ))}
        </select>
        {availablePorts.length === 0 && !isLoading && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ No ports found. Check connections and refresh.
          </p>
        )}
      </div>

      {/* Connection Controls */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={connectSerial}
          disabled={isConnected || !selectedPort || isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Zap size={16} />
          Connect
        </button>
        <button
          onClick={disconnectSerial}
          disabled={!isConnected}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Unplug size={16} />
          Disconnect
        </button>
      </div>

      {/* Duration Control */}
      <div className="mb-6">
        <label
          htmlFor="duration-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Duration (seconds)
        </label>
        <div className="relative flex items-center">
          <input
            id="duration-input"
            type="number"
            min="1"
            max="3600"
            value={duration}
            onChange={handleInputChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-semibold"
          />
          <div className="absolute right-2 flex flex-col gap-0.5">
            <button
              onClick={() => adjustDuration(1)}
              className="w-6 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-xs leading-none"
              aria-label="Increase duration"
            >
              ▲
            </button>
            <button
              onClick={() => adjustDuration(-1)}
              className="w-6 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-xs leading-none"
              aria-label="Decrease duration"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      {/* Command Preview */}
      <div className="mb-6 p-3 bg-gray-50 rounded-md border">
        <p className="text-xs text-gray-600 mb-2 font-medium">
          Command Preview:
        </p>
        <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs break-all">
          {JSON.stringify(currentCommand, null, 2)}
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={sendCommand}
        disabled={!isConnected || isSending}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-lg"
      >
        <Play size={20} className={isSending ? "animate-pulse" : ""} />
        {isSending ? "Sending Command..." : "Send Pump Command"}
      </button>

      {/* Usage Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Required:</strong> Install{" "}
          <code className="bg-blue-100 px-1 rounded">
            npm install serialport @types/serialport
          </code>
          <br />
          <strong>Structure:</strong> API routes in{" "}
          <code className="bg-blue-100 px-1 rounded">
            app/api/serial/*/route.ts
          </code>
        </p>
      </div>
    </div>
  );
};

export default SerialPumpController;
