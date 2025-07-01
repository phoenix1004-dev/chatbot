"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";

// Context to share close function with dropdown items
const DropdownContext = createContext<{ close: () => void } | null>(null);

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
  align?: "left" | "right";
  showSearch?: boolean;
  searchPlaceholder?: string;
  maxHeight?: string;
  menuWidth?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = "",
  menuClassName = "",
  align = "left",
  showSearch = false,
  searchPlaceholder = "Search...",
  maxHeight = "300px",
  menuWidth = "280px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(true);
    // Focus search input after dropdown opens
    if (showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Add a small delay to allow click events to process first
      setTimeout(() => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          closeDropdown();
        }
      }, 0);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        ref={triggerRef}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
      >
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <DropdownContext.Provider value={{ close: closeDropdown }}>
            <div
              className={`absolute mt-1 bg-background border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 ${
                align === "right" ? "right-0" : "left-0"
              } ${menuClassName}`}
              style={{
                top: `${menuPosition.top}px`,
                left:
                  align === "right"
                    ? `${
                        menuPosition.left -
                        parseInt(menuWidth) +
                        (triggerRef.current?.offsetWidth || 0)
                      }px`
                    : `${menuPosition.left}px`,
                width: menuWidth,
              }}
            >
              {showSearch && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div
                className={
                  maxHeight === "none" ? "" : "overflow-y-auto dropdown-scroll"
                }
                style={maxHeight === "none" ? {} : { maxHeight: maxHeight }}
              >
                {children}
              </div>
            </div>
          </DropdownContext.Provider>,
          document.body
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("DropdownItem clicked, calling onClick");
    onClick?.();
    // Small delay to ensure the click handler executes before closing
    setTimeout(() => {
      context?.close();
    }, 10);
  };

  return (
    <div
      className={`px-3 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer first:rounded-t-md last:rounded-b-md ${className}`}
      onMouseDown={handleClick}
    >
      {children}
    </div>
  );
};
