import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistants - Chatbot",
  description: "Browse and select from our collection of specialized AI assistants",
};

export default function AssistantsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {children}
    </div>
  );
}
