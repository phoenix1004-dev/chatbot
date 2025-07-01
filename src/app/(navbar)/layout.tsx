"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/navbar/Topbar";
import { Sidebar } from "@/components/navbar/Sidebar";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ChatProvider, useChat } from "@/contexts/ChatContext";

function NavbarLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCreatingChat } = useChat();

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
