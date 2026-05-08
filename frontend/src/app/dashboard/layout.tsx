'use client';

import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { ChatWidget } from '@/components/ChatWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      {/* Floating Chat Widget – uses ChatService → POST /api/chat/send */}
      <ChatWidget />
    </div>
  );
}
