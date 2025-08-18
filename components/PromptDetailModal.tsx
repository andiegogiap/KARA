
import React from 'react';
import { Prompt, AIRecommendation, AIChoice, ConversationTurn, SavedThread } from '../types';
import { getAiRecommendation } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

// --- SVG Icons ---
const CloseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const ClipboardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25H9a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);
const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);
const BookmarkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 11.186 0Z" />
    </svg>
);

// --- Copy Button Component ---
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-all duration-200"
            aria-label={isCopied ? "Copied" : "Copy recommendation"}
        >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
        </button>
    );
};

// --- Main Modal Component ---
interface PromptDetailModalProps {
  prompt: Prompt;
  onClose: () => void;
  onSave: (thread: SavedThread) => void;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ prompt, onClose, onSave }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [conversationTurns, setConversationTurns] = React.useState<ConversationTurn[]>([]);
  const [error, setError] = React.useState<string>('');
  const [selectedChoice, setSelectedChoice] = React.useState<AIChoice | null>(null);
  
  const mainContentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const fetchAndSetRecommendation = async (currentPrompt: Prompt, history: ConversationTurn[]) => {
      setIsLoading(true);
      setError('');
      const historyTitles = history.map(turn => turn.promptTitle);
      const response = await getAiRecommendation(currentPrompt, historyTitles);
      if ('error' in response) {
        setError(response.error);
      } else {
        const newTurn: ConversationTurn = {
          promptTitle: currentPrompt.title,
          promptDescription: currentPrompt.description,
          aiRecommendation: response,
        };
        setConversationTurns([...history, newTurn]);
      }
      setIsLoading(false);
  };

  React.useEffect(() => {
    // Initial fetch when component mounts
    setConversationTurns([]);
    setSelectedChoice(null);
    fetchAndSetRecommendation(prompt, []);
  }, [prompt]);

  React.useEffect(() => {
    // Scroll to bottom when content changes
    if (mainContentRef.current) {
        mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
    }
  }, [conversationTurns, isLoading]);

  const handleContinue = () => {
    if (!selectedChoice) return;
    const nextPrompt: Prompt = {
      value: conversationTurns.length + 2, // Not a great value, but keeps type consistency
      title: selectedChoice.title,
      description: selectedChoice.description,
    };
    setSelectedChoice(null);
    fetchAndSetRecommendation(nextPrompt, conversationTurns);
  };

  const handleSaveThread = () => {
    const newThread: SavedThread = {
        id: Date.now().toString(),
        originalPromptTitle: prompt.title,
        turns: conversationTurns,
        savedAt: new Date().toISOString()
    };
    onSave(newThread);
    onClose();
  };
  
  const lastTurn = conversationTurns.length > 0 ? conversationTurns[conversationTurns.length - 1] : null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .prose a { color: #22d3ee; } .prose a:hover { color: #67e8f9; }
      `}</style>
      <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl shadow-black/50 w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 border-b border-gray-700 flex justify-between items-start shrink-0">
          <div>
            <span className="bg-cyan-900/50 text-cyan-300 text-xs font-semibold rounded-full px-3 py-1 mb-2 inline-block">
              Topic: {prompt.title}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">KARA's Iterative Guide</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-full" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main ref={mainContentRef} className="p-6 flex-grow overflow-y-auto space-y-8">
            {conversationTurns.map((turn, index) => (
                <div key={index} className="space-y-6 animate-fade-in">
                    <div className="border-l-4 border-fuchsia-500 pl-4">
                        <h3 className="text-xl font-bold text-white">{turn.promptTitle}</h3>
                        <p className="text-gray-400 text-sm">{turn.promptDescription}</p>
                    </div>
                    <div className="relative prose prose-sm sm:prose-base max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="text-gray-200 text-lg font-semibold border-b border-gray-600 pb-2 mb-4">KARA's Recommendation</h4>
                        {turn.aiRecommendation.recommendation}
                        <CopyButton textToCopy={turn.aiRecommendation.recommendation} />
                    </div>
                </div>
            ))}

            {lastTurn && !isLoading && (
                <div className="space-y-4 pt-4 border-t border-gray-700/50 animate-fade-in">
                    <h3 className="text-gray-200 text-lg font-semibold">Choose Your Next Step</h3>
                    <div className="space-y-3">
                        {lastTurn.aiRecommendation.choices.map((choice, index) => (
                            <label key={index} className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedChoice?.title === choice.title ? 'bg-cyan-900/40 border-cyan-500 shadow-md' : 'bg-gray-800/60 border-gray-700 hover:border-cyan-400'}`}>
                                <input 
                                    type="radio"
                                    name="ai-choice"
                                    checked={selectedChoice?.title === choice.title}
                                    onChange={() => setSelectedChoice(choice)}
                                    className="mt-1 h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold text-gray-100">{choice.title}</p>
                                    <p className="text-sm text-gray-400">{choice.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            
            {isLoading && <LoadingSpinner />}
            {error && <div className="bg-red-900/50 border border-red-500/60 text-red-300 p-4 rounded-lg">{error}</div>}
        </main>
        
        <footer className="p-4 border-t border-gray-700 flex justify-end items-center gap-4 shrink-0">
             <button
                onClick={handleSaveThread}
                disabled={conversationTurns.length === 0 || isLoading}
                className="flex items-center gap-2 bg-transparent border border-fuchsia-500 text-fuchsia-300 font-semibold px-6 py-2 rounded-lg hover:bg-fuchsia-500/20 transition-all duration-200 disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
                <BookmarkIcon className="w-5 h-5" />
                Bookmark Thread
            </button>
            <button
                onClick={handleContinue}
                disabled={!selectedChoice || isLoading}
                className="bg-cyan-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-cyan-600 transition-all duration-200 disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/30"
            >
                Continue &rarr;
            </button>
        </footer>
      </div>
    </div>
  );
};

export default PromptDetailModal;
