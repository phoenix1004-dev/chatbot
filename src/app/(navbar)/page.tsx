"use client";

import { MessageInput } from "@/components/chat/MessageInput";
import { useChat } from "@/contexts/ChatContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { selectedAssistant, isCreatingChat, setIsCreatingChat, refreshChats } =
    useChat();
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!selectedAssistant) {
      console.error("No assistant selected");
      return;
    }

    setIsCreatingChat(true);
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistant_id: selectedAssistant.id,
          first_message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create chat");
      }

      const newChat = await response.json();

      // Refresh the sidebar to show the new chat
      refreshChats();

      // Navigate to the new chat - this will trigger the AI response generation
      router.push(`/chat/${newChat.id}`);

      console.log("New chat created:", newChat);
    } catch (error) {
      console.error("Error creating chat:", error);
      // TODO: Show error message to user
    } finally {
      setIsCreatingChat(false);
    }

    if (attachments && attachments.length > 0) {
      console.log(
        "Attachments:",
        attachments.map((f) => f.name)
      );
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hello there!</h1>
        <p className="text-xl text-gray-400">How can I help you today?</p>
      </div>
      <div className="absolute bottom-0 w-full">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isCreatingChat || isSendingMessage || !selectedAssistant}
          placeholder={
            !selectedAssistant
              ? "Select an assistant to start chatting..."
              : isCreatingChat
              ? "Creating chat..."
              : isSendingMessage
              ? "Sending message..."
              : "Send a message..."
          }
        />
      </div>
    </div>
  );
}
