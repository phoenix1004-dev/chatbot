"use client";

import { Topbar } from "@/components/navbar/Topbar";
import { Sidebar } from "@/components/navbar/Sidebar";
import { MessageInput } from "@/components/chat/MessageInput";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleSendMessage = (message: string, attachments?: File[]) => {
    console.log("Message sent:", message);
    if (attachments && attachments.length > 0) {
      console.log(
        "Attachments:",
        attachments.map((f) => f.name)
      );
    }
    // TODO: Implement actual message sending logic
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#0a0a0a]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto bg-[#0a0a0a]">{children}</main>
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </SidebarProvider>
  );
}
