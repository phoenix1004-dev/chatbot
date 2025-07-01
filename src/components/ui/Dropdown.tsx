"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";

// Context to share close function with dropdown items
const DropdownContext = createContext<{ close: () => void } | null>(null);

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <DropdownContext.Provider value={{ close: closeDropdown }}>
          <div className="absolute top-full left-0 mt-1 bg-background border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-[280px]">
            {children}
          </div>
        </DropdownContext.Provider>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className = "",
}) => {
  const context = useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    context?.close();
  };

  return (
    <div
      className={`px-3 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer first:rounded-t-md last:rounded-b-md ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
