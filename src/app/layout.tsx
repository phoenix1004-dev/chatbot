import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Topbar } from "@/components/navbar/Topbar";
import { Sidebar } from "@/components/navbar/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot",
  description: "A modern chatbot application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
        data-new-gr-c-s-check-loaded="14.1242.0"
        data-gr-ext-installed=""
      >
        <SidebarProvider>
          <div className="flex h-screen bg-[#0a0a0a]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <main className="flex-1 overflow-auto bg-[#0a0a0a]">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
