"use client";

import { useState } from "react";
import TextChat from "@/components/TextChat";
import VoiceChat from "@/components/VoiceChat";
import TabToggle from "@/components/TabToggle";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">AI Chat Assistant</h1>
      </header>

      <TabToggle activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Text Chat (Left Side on desktop, shown/hidden on mobile) */}
        <div
          className={`flex-1 md:border-r border-gray-200 h-[calc(100vh-110px)] md:h-[calc(100vh-64px)] ${activeTab === 'text' ? 'block' : 'hidden md:block'}`}
        >
          <TextChat />
        </div>

        {/* Voice Chat (Right Side on desktop, shown/hidden on mobile) */}
        <div
          className={`flex-1 h-[calc(100vh-110px)] md:h-[calc(100vh-64px)] ${activeTab === 'voice' ? 'block' : 'hidden md:block'}`}
        >
          <VoiceChat />
        </div>
      </main>
    </div>
  );
}
