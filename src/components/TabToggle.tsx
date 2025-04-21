"use client";

interface TabToggleProps {
  activeTab: 'text' | 'voice';
  setActiveTab: (tab: 'text' | 'voice') => void;
}

export default function TabToggle({ activeTab, setActiveTab }: TabToggleProps) {
  return (
    <div className="flex w-full border-b border-gray-200 md:hidden">
      <button
        className={`flex-1 py-3 text-center font-medium ${
          activeTab === 'text'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500'
        }`}
        onClick={() => setActiveTab('text')}
      >
        Text Chat
      </button>
      <button
        className={`flex-1 py-3 text-center font-medium ${
          activeTab === 'voice'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500'
        }`}
        onClick={() => setActiveTab('voice')}
      >
        Voice Chat
      </button>
    </div>
  );
}
