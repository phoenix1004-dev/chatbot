"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/navbar/Topbar";
import { Sidebar } from "@/components/navbar/Sidebar";
import { MessageInput } from "@/components/chat/MessageInput";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ChatProvider, useChat } from "@/contexts/ChatContext";

function NavbarLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {
    selectedAssistant,
    currentChat,
    setCurrentChat,
    isCreatingChat,
    setIsCreatingChat,
    refreshChats,
  } = useChat();

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!selectedAssistant) {
      console.error("No assistant selected");
      return;
    }

    // If there's no current chat, create a new one
    if (!currentChat) {
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
        setCurrentChat(newChat);

        // Refresh the sidebar to show the new chat
        refreshChats();

        // Navigate to the new chat
        router.push(`/chat/${newChat.id}`);

        console.log("New chat created:", newChat);
      } catch (error) {
        console.error("Error creating chat:", error);
        // TODO: Show error message to user
      } finally {
        setIsCreatingChat(false);
      }
    } else {
      // TODO: Send message to existing chat
      console.log("Sending message to existing chat:", message);
    }

    if (attachments && attachments.length > 0) {
      console.log(
        "Attachments:",
        attachments.map((f) => f.name)
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#0a0a0a]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto bg-[#0a0a0a] relative">
            {children}
            <LoadingOverlay
              isVisible={isCreatingChat}
              message="Creating your chat..."
            />
          </main>
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isCreatingChat || !selectedAssistant}
            placeholder={
              !selectedAssistant
                ? "Select an assistant to start chatting..."
                : isCreatingChat
                ? "Creating chat..."
                : "Send a message..."
            }
          />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <NavbarLayoutContent>{children}</NavbarLayoutContent>
    </ChatProvider>
  );
}
