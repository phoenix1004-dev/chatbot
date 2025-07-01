"use client";

import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import { HiEllipsisHorizontal } from "react-icons/hi2";

interface ChatItem {
  id: string;
  title: string;
  timestamp?: string;
}

const chatHistory: ChatItem[] = [
  {
    id: "greeting",
    title: "Greeting",
  },
  {
    id: "weather",
    title: "Weather in San Francisco",
  },
];

export const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`h-full bg-[#0a0a0a] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0"
      } overflow-hidden`}
    >
      {isOpen && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 min-w-64">
            <h1 className="text-white text-lg font-medium">Chatbot</h1>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-w-64">
            {/* Today Section */}
            <div className="p-4">
              <h2 className="text-white text-sm font-medium mb-3">Today</h2>

              {/* Chat History Items */}
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                  >
                    <span className="text-white text-sm truncate flex-1">
                      {chat.title}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity">
                      <HiEllipsisHorizontal
                        size={16}
                        className="text-gray-400"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* End of history message */}
            <div className="px-4 pb-4 mt-8">
              <p className="text-gray-500 text-sm text-center">
                You have reached the end of your chat history.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
