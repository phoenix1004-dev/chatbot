"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Assistant, Chat, ChatWithAssistant, Message } from "@/types/assistant";

interface ChatContextType {
  selectedAssistant: Assistant | null;
  setSelectedAssistant: (assistant: Assistant | null) => void;
  currentChat: ChatWithAssistant | null;
  setCurrentChat: (chat: ChatWithAssistant | null) => void;
  isCreatingChat: boolean;
  setIsCreatingChat: (creating: boolean) => void;
  refreshChats: () => void;
  setRefreshChats: (refreshFn: () => void) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isLoadingMessages: boolean;
  setIsLoadingMessages: (loading: boolean) => void;
  isSendingMessage: boolean;
  setIsSendingMessage: (sending: boolean) => void;
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
  const [currentChat, setCurrentChat] = useState<ChatWithAssistant | null>(
    null
  );
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [refreshChats, setRefreshChats] = useState<() => void>(() => () => {});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

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
        messages,
        setMessages,
        isLoadingMessages,
        setIsLoadingMessages,
        isSendingMessage,
        setIsSendingMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
