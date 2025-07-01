import { Topbar } from "@/components/navbar/Topbar";
import { Sidebar } from "@/components/navbar/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#0a0a0a]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto bg-[#0a0a0a]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
