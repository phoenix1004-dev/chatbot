"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "../../contexts/SidebarContext";
import { useChat } from "../../contexts/ChatContext";
import { HiEllipsisHorizontal, HiPlus } from "react-icons/hi2";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Chat } from "@/types/assistant";

export const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const { currentChat, setCurrentChat, setRefreshChats } = useChat();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch chats function
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/chats");
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const chatsData = await response.json();
      setChats(chatsData);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chats on component mount and register refresh function
  useEffect(() => {
    fetchChats();
    // Register the refresh function with the context
    setRefreshChats(() => fetchChats);
  }, [setRefreshChats]);

  const handleChatClick = (chat: Chat) => {
    setCurrentChat(chat);
    router.push(`/chat/${chat.id}`);
  };

  const handleNewChat = () => {
    // Clear current chat to start a new one
    setCurrentChat(null);
    // Navigate to home page where user can start a new chat
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group chats by date
  const groupedChats = chats.reduce(
    (groups: { [key: string]: Chat[] }, chat) => {
      const dateKey = formatDate(chat.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(chat);
      return groups;
    },
    {}
  );

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
            <button
              onClick={handleNewChat}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              title="New Chat"
            >
              <HiPlus size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-w-64">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="text-red-400 text-sm text-center">{error}</div>
                <button
                  onClick={fetchChats}
                  className="mt-2 w-full px-3 py-1 bg-red-700 text-red-200 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-4">
                <p className="text-gray-500 text-sm text-center">
                  No chats yet. Click the + button above to start a new
                  conversation.
                </p>
              </div>
            ) : (
              Object.entries(groupedChats).map(([dateKey, dateChats]) => (
                <div key={dateKey} className="p-4">
                  <h2 className="text-white text-sm font-medium mb-3">
                    {dateKey}
                  </h2>

                  {/* Chat History Items */}
                  <div className="space-y-1">
                    {dateChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatClick(chat)}
                        className={`group flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer ${
                          currentChat?.id === chat.id ? "bg-gray-800" : ""
                        }`}
                      >
                        <span className="text-white text-sm truncate flex-1">
                          {chat.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement chat options menu
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity"
                        >
                          <HiEllipsisHorizontal
                            size={16}
                            className="text-gray-400"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* End of history message */}
            {chats.length > 0 && (
              <div className="px-4 pb-4 mt-8">
                <p className="text-gray-500 text-sm text-center">
                  You have reached the end of your chat history.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
