import React, { useState } from 'react';
import ThinkingSwitch from './components/ThinkingSwitch';
import CopywritingForm from './components/CopywritingForm';
import CategoryForm from './components/CategoryForm';
import ChatWindow from './components/ChatWindow';
import ApprovedVersions from './components/ApprovedVersions';
import { ApprovedVersionsStore } from './types';

const App: React.FC = () => {
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dish'); // 'dish', 'category', 'chat', or 'approved'
  const [approvedVersions, setApprovedVersions] = useState<ApprovedVersionsStore>({});

  const handleToggle = () => {
    setIsThinkingMode(prev => !prev);
  };

  // FIX: Changed component to use 'label' prop instead of 'children' to resolve the error.
  const TabButton = ({ tabId, label }: { tabId: string, children?: React.ReactNode, label: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId
          ? 'bg-orange-600 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-900 text-white font-sans w-screen h-screen flex flex-col items-center p-2 sm:p-4">
       <div className="w-full max-w-4xl h-full flex flex-col bg-gray-800/50 rounded-lg border border-gray-700">
            <header className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                        W
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Gerador de Descrições</h1>
                        <p className="text-sm text-gray-400">O Sopro da Wok</p>
                    </div>
                </div>
                <ThinkingSwitch isThinkingMode={isThinkingMode} onToggle={handleToggle} />
            </header>

            <nav className="flex p-4 space-x-2 border-b border-gray-700 bg-gray-800/25 overflow-x-auto">
                {/* FIX: Updated TabButton calls to use the 'label' prop. */}
                <TabButton tabId="dish" label="Gerar por Prato" />
                <TabButton tabId="category" label="Gerar por Categoria" />
                <TabButton tabId="chat" label="Chat Rápido" />
                <TabButton tabId="approved" label="Versões Aprovadas" />
            </nav>
            
            <main className="flex-1 min-h-0 overflow-y-auto">
                {activeTab === 'dish' && <CopywritingForm isThinkingMode={isThinkingMode} setApprovedVersions={setApprovedVersions} />}
                {activeTab === 'category' && <CategoryForm isThinkingMode={isThinkingMode} setApprovedVersions={setApprovedVersions} />}
                {activeTab === 'chat' && <ChatWindow isThinkingMode={isThinkingMode} />}
                {activeTab === 'approved' && <ApprovedVersions approvedVersions={approvedVersions} setApprovedVersions={setApprovedVersions} />}
            </main>
        </div>
    </div>
  );
};

export default App;
