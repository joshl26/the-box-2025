"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { handleMenuAction } from "../actions";

interface DropdownOption {
  id: string;
  label: string;
  value: string;
  action?: string;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export default function DropdownMenu({
  options,
  placeholder = "Select an option",
  className = "",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = async (option: DropdownOption) => {
    setIsLoading(true);
    setSelectedOption(option);
    setIsOpen(false);

    try {
      // Call server action
      const result = await handleMenuAction(
        option.action || "select",
        option.value
      );

      console.log("Server response:", result);

      // You can handle the server response here
      // For example, show a toast notification, update UI, etc.
    } catch (error) {
      console.error("Server action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium 
          text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? "ring-2 ring-blue-500 ring-offset-2" : ""}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="truncate">
          {isLoading ? "Processing..." : selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-full origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 transition-colors duration-150"
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
