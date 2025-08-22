
import React from 'react';
import { SavedThread } from '../types';
import LoadingSpinner from './LoadingSpinner';

const CloseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const EmptyState = () => (
    <div className="text-center p-8">
        <div className="mx-auto h-12 w-12 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 11.186 0Z" />
            </svg>
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-200">No Bookmarked Threads</h3>
        <p className="mt-1 text-sm text-gray-400">Your saved conversations will appear here.</p>
    </div>
);

interface SavedThreadsPanelProps {
    threads: SavedThread[];
    isOpen: boolean;
    onClose: () => void;
    onGenerateResearch: (threadId: string) => void;
    onViewGuidance: (threadId: string) => void;
}

const SavedThreadsPanel: React.FC<SavedThreadsPanelProps> = ({ threads, isOpen, onClose, onGenerateResearch, onViewGuidance }) => {
    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-lg glass transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-900/95 backdrop-blur-lg z-10">
                    <h2 className="text-xl font-bold text-white">Bookmarked Threads</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-full" aria-label="Close panel">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-4 h-[calc(100vh-65px)] overflow-y-auto space-y-4">
                    {threads.length === 0 ? <EmptyState /> : threads.map(thread => (
                        <div key={thread.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 group space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-200">{thread.originalPromptTitle}</h3>
                                <p className="text-xs text-gray-500">Saved on {new Date(thread.savedAt).toLocaleString()}</p>
                            </div>
                            
                            <details className="w-full">
                                <summary className="text-sm text-cyan-400 cursor-pointer list-none">View Conversation ({thread.turns.length} turns)</summary>
                                <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                                    {thread.turns.map((turn, index) => (
                                        <div key={index} className="pl-3 border-l-2 border-fuchsia-600">
                                            <p className="font-semibold text-gray-300">{turn.promptTitle}</p>
                                            <p className="text-sm text-gray-400 whitespace-pre-wrap mt-2 prose prose-sm max-w-none prose-invert">{turn.aiRecommendation.recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </details>

                            <div className="pt-4 border-t border-gray-700/50 flex flex-wrap gap-2 justify-end">
                                {thread.isGeneratingResearch ? (
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Analyzing...
                                    </div>
                                ) : thread.deepResearch ? (
                                    <button 
                                        onClick={() => onViewGuidance(thread.id)}
                                        className="text-sm bg-green-500 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        View Guidance
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => onGenerateResearch(thread.id)}
                                        className="text-sm bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-cyan-600 transition-colors"
                                    >
                                        Analyze Nuances
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavedThreadsPanel;