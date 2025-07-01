"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Assistant, Chat } from "@/types/assistant";

interface ChatContextType {
  selectedAssistant: Assistant | null;
  setSelectedAssistant: (assistant: Assistant | null) => void;
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  isCreatingChat: boolean;
  setIsCreatingChat: (creating: boolean) => void;
  refreshChats: () => void;
  setRefreshChats: (refreshFn: () => void) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [refreshChats, setRefreshChats] = useState<() => void>(() => () => {});

  return (
    <ChatContext.Provider
      value={{
        selectedAssistant,
        setSelectedAssistant,
        currentChat,
        setCurrentChat,
        isCreatingChat,
        setIsCreatingChat,
        refreshChats,
        setRefreshChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
