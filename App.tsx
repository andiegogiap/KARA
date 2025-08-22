
import React, { useState } from 'react';
import { Prompt, SavedThread, Nuance } from './types';
import { DEPLOYMENT_PROMPTS } from './constants';
import { getDeepResearch } from './services/geminiService';
import PromptCard from './components/PromptCard';
import PromptDetailModal from './components/PromptDetailModal';
import SavedThreadsPanel from './components/SavedThreadsPanel';
import GuidancePanel from './components/GuidancePanel';
import WorkshopView from './components/WorkshopView';
import DocumentPresenterPanel from './components/DocumentPresenterPanel';


const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const GuidanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-1.125 0-2.062.938-2.062 2.063v15.375c0 1.125.938 2.063 2.063 2.063h12.75c1.125 0 2.063-.938 2.063-2.063V15.75m-3.375-12.375L16.5 3.75m-3.375-1.5L12 6.375m3.375-3.375-3.375 3.375M9 15l-3 3m0 0l3-3m-3 3h12" />
    </svg>
);


const App: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [savedThreads, setSavedThreads] = useState<SavedThread[]>([]);
  
  const [isThreadsPanelOpen, setIsThreadsPanelOpen] = useState(false);
  const [isGuidancePanelOpen, setIsGuidancePanelOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [workshopState, setWorkshopState] = useState<{ threadId: string; nuance: Nuance; nuanceIndex: number } | null>(null);
  const [documentState, setDocumentState] = useState<{ nuance: Nuance } | null>(null);

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleCloseModal = () => {
    setSelectedPrompt(null);
  };

  const handleSaveThread = (thread: SavedThread) => {
      setSavedThreads(prev => [thread, ...prev]);
  };

  const handleGenerateResearch = async (threadId: string) => {
    setSavedThreads(prev => prev.map(t => t.id === threadId ? { ...t, isGeneratingResearch: true } : t));
    
    const threadToAnalyze = savedThreads.find(t => t.id === threadId);
    if (!threadToAnalyze) return;

    const result = await getDeepResearch(threadToAnalyze);

    setSavedThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        if ('error' in result) {
          console.error(result.error);
          return { ...t, isGeneratingResearch: false };
        }
        return { ...t, isGeneratingResearch: false, deepResearch: result };
      }
      return t;
    }));
  };

  const handleViewGuidance = (threadId: string) => {
      setActiveThreadId(threadId);
      setIsGuidancePanelOpen(true);
  };
  
  const handleOpenWorkshop = (threadId: string, nuance: Nuance, nuanceIndex: number) => {
    setWorkshopState({ threadId, nuance, nuanceIndex });
    setIsGuidancePanelOpen(false);
  };
  
  const handleSaveAndCloseWorkshop = (threadId: string, nuanceIndex: number, workshopContent: Record<string, string>) => {
    setSavedThreads(prev => 
        prev.map(thread => {
            if (thread.id === threadId && thread.deepResearch) {
                const newNuances = [...thread.deepResearch.nuances];
                const updatedNuance = { ...newNuances[nuanceIndex], workshopContent };
                newNuances[nuanceIndex] = updatedNuance;
                return { ...thread, deepResearch: { ...thread.deepResearch, nuances: newNuances } };
            }
            return thread;
        })
    );
    setWorkshopState(null);
  };
  
  const handleViewDocument = (nuance: Nuance) => {
    setDocumentState({ nuance });
  };

  const handleCloseDocument = () => {
    setDocumentState(null);
  };

  const activeThread = savedThreads.find(t => t.id === activeThreadId);

  return (
    <div className="min-h-screen text-gray-300 font-sans">
      <div className="relative min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <header className="text-center mb-16 relative flex justify-between items-center">
               <button 
                onClick={() => setIsGuidancePanelOpen(true)}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="Open guidance panel"
              >
                  <GuidanceIcon className="w-8 h-8"/>
              </button>

              <div className="flex-grow">
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-100 font-orbitron">
                    KARA
                    <span 
                      className="text-fuchsia-500" 
                      style={{ textShadow: '0 0 8px rgba(217, 70, 239, 0.5)' }}
                    >
                      .
                    </span> UI/UX Design & Development Guide
                  </h1>
                  <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                    Transforming UI/UX concepts into brilliant, user-centric applications. Select a phase below to begin an iterative conversation with KARA.
                  </p>
              </div>

              <button 
                onClick={() => setIsThreadsPanelOpen(true)}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="Open saved threads"
              >
                  <MenuIcon className="w-8 h-8"/>
                  {savedThreads.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-fuchsia-500 items-center justify-center text-xs text-white">
                              {savedThreads.length}
                          </span>
                      </span>
                  )}
              </button>
            </header>

            <main>
              {workshopState ? (
                <WorkshopView 
                    workshopState={workshopState} 
                    onSaveAndClose={handleSaveAndCloseWorkshop} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {DEPLOYMENT_PROMPTS.map((prompt) => (
                    <PromptCard
                      key={prompt.value}
                      prompt={prompt}
                      onSelect={handleSelectPrompt}
                    />
                  ))}
                </div>
              )}
            </main>

            <footer className="text-center mt-16 text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} AI Family Nuances Initiative. All rights reserved.</p>
              <p>Powered by Gemini and React.</p>
            </footer>
        </div>
      </div>
      
      <GuidancePanel
        thread={activeThread}
        isOpen={isGuidancePanelOpen}
        onClose={() => setIsGuidancePanelOpen(false)}
        onOpenWorkshop={handleOpenWorkshop}
        onViewDocument={handleViewDocument}
      />

      <SavedThreadsPanel
        threads={savedThreads}
        isOpen={isThreadsPanelOpen}
        onClose={() => setIsThreadsPanelOpen(false)}
        onGenerateResearch={handleGenerateResearch}
        onViewGuidance={handleViewGuidance}
      />

      {selectedPrompt && (
        <PromptDetailModal
          prompt={selectedPrompt}
          onClose={handleCloseModal}
          onSave={handleSaveThread}
        />
      )}

      {documentState && (
        <DocumentPresenterPanel
          nuance={documentState.nuance}
          onClose={handleCloseDocument}
        />
      )}
    </div>
  );
};

export default App;