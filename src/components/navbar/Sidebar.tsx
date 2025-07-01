"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "../../contexts/SidebarContext";
import { useChat } from "../../contexts/ChatContext";
import {
  HiEllipsisHorizontal,
  HiPlus,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ChatWithAssistant } from "@/types/assistant";
import { Dropdown, DropdownItem } from "../ui/Dropdown";

export const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const { currentChat, setCurrentChat, setRefreshChats } = useChat();
  const [chats, setChats] = useState<ChatWithAssistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleChatClick = (chat: ChatWithAssistant) => {
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
    (groups: { [key: string]: ChatWithAssistant[] }, chat) => {
      const dateKey = formatDate(chat.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(chat);
      return groups;
    },
    {}
  );

  const handleStartRename = (chatId: string, title: string) => {
    console.log("handleStartRename called with:", chatId, title);
    setRenamingChatId(chatId);
    setNewTitle(title);
  };

  const handleUpdateChat = async (chatId: string) => {
    if (!newTitle || newTitle.trim() === "") {
      setRenamingChatId(null);
      return;
    }

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update chat title");
      }

      fetchChats();
    } catch (error) {
      console.error("Error updating chat:", error);
      alert("Failed to update chat title.");
    } finally {
      setRenamingChatId(null);
    }
  };

  const handleDeleteClick = (chatId: string) => {
    console.log("handleDeleteClick called with:", chatId);
    setDeletingChatId(chatId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingChatId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/chats/${deletingChatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      // If the deleted chat was the current one, navigate away
      if (currentChat?.id === deletingChatId) {
        setCurrentChat(null);
        router.push("/");
      }

      // Refresh the chat list
      fetchChats();
      setShowDeleteConfirm(false);
      setDeletingChatId(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeletingChatId(null);
  };

  return (
    <div
      className={`h-full bg-[#0a0a0a] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0"
      }`}
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
                        onClick={() =>
                          renamingChatId !== chat.id && handleChatClick(chat)
                        }
                        className={`group flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer ${
                          currentChat?.id === chat.id ? "bg-gray-800" : ""
                        }`}
                      >
                        {renamingChatId === chat.id ? (
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => handleUpdateChat(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateChat(chat.id);
                              } else if (e.key === "Escape") {
                                setRenamingChatId(null);
                              }
                            }}
                            className="text-white text-sm bg-gray-800 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                            autoFocus
                          />
                        ) : (
                          <span className="text-white text-sm truncate flex-1">
                            {chat.title}
                          </span>
                        )}
                        <div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Dropdown
                            align="right"
                            menuWidth="120px"
                            trigger={
                              <button className="p-1 hover:bg-gray-700 rounded">
                                <HiEllipsisHorizontal
                                  size={16}
                                  className="text-gray-400"
                                />
                              </button>
                            }
                          >
                            <DropdownItem
                              onClick={() => {
                                console.log(
                                  "Rename DropdownItem onClick triggered"
                                );
                                handleStartRename(chat.id, chat.title);
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <HiPencil size={16} />
                                <span>Rename</span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                console.log(
                                  "Delete DropdownItem onClick triggered"
                                );
                                handleDeleteClick(chat.id);
                              }}
                            >
                              <div className="flex items-center space-x-2 text-red-500">
                                <HiTrash size={16} />
                                <span>Delete</span>
                              </div>
                            </DropdownItem>
                          </Dropdown>
                        </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingChatId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Chat
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
