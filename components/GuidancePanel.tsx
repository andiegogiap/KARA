
import React from 'react';
import { DeepResearchData, SavedThread, Nuance } from '../types';

const CloseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const EmptyState = () => (
    <div className="text-center p-8 flex flex-col items-center h-full justify-center">
        <div className="mx-auto h-16 w-16 text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-1.125 0-2.062.938-2.062 2.063v15.375c0 1.125.938 2.063 2.063 2.063h12.75c1.125 0 2.063-.938 2.063-2.063V15.75m-3.375-12.375L16.5 3.75m-3.375-1.5L12 6.375m3.375-3.375-3.375 3.375M9 15l-3 3m0 0l3-3m-3 3h12" />
            </svg>
        </div>
        <h3 className="mt-4 text-xl font-medium text-gray-200">Guidance Panel</h3>
        <p className="mt-2 text-sm text-gray-400 max-w-xs mx-auto">
            Analyze a bookmarked thread from the right-side menu to generate an actionable workflow here.
        </p>
    </div>
);


interface GuidancePanelProps {
    thread?: SavedThread;
    isOpen: boolean;
    onClose: () => void;
    onOpenWorkshop: (threadId: string, nuance: Nuance, nuanceIndex: number) => void;
    onViewDocument: (nuance: Nuance) => void;
}

const GuidancePanel: React.FC<GuidancePanelProps> = ({ thread, isOpen, onClose, onOpenWorkshop, onViewDocument }) => {
    const data = thread?.deepResearch;
    
    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`fixed top-0 left-0 h-full w-full max-w-lg bg-gray-900/95 backdrop-blur-lg border-r border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-900/95 backdrop-blur-lg z-10">
                    <h2 className="text-xl font-bold text-white">Operator Guidance Flow</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-full" aria-label="Close panel">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-4 h-[calc(100vh-65px)] overflow-y-auto">
                    {!data || !thread ? <EmptyState /> : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-cyan-300 tracking-wide">Strategic Summary</h3>
                                <p className="mt-2 text-gray-400 prose prose-sm max-w-none prose-invert">{data.summary}</p>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-fuchsia-400 tracking-wide">Actionable Nuances</h3>
                                {data.nuances.map((nuance, index) => {
                                    const hasContent = nuance.workshopContent && Object.values(nuance.workshopContent).some(v => v.length > 0);
                                    return (
                                     <details key={nuance.importance} className="bg-gray-800/50 border border-gray-700 rounded-lg group transition-colors hover:border-gray-600" open>
                                        <summary className="font-semibold text-gray-200 cursor-pointer list-none flex justify-between items-center group-hover:text-white p-3">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-fuchsia-900/50 text-fuchsia-300 text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-fuchsia-500 shadow-sm shrink-0">
                                                    {nuance.importance}
                                                </span>
                                                <span>{nuance.title}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform duration-200 ml-2">&rarr;</span>
                                        </summary>
                                        <div className="px-3 pb-3">
                                          <div className="mt-3 pt-3 border-t border-gray-700/50 text-gray-400 prose prose-sm max-w-none prose-invert">
                                             {nuance.detail}
                                          </div>
                                          <div className="mt-4 flex justify-end gap-3">
                                              {hasContent && (
                                                <button
                                                  onClick={() => onViewDocument(nuance)}
                                                  className="bg-transparent border border-cyan-500 text-cyan-300 text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-cyan-500/20 transition-colors"
                                                >
                                                  View Document
                                                </button>
                                              )}
                                              <button 
                                                onClick={() => onOpenWorkshop(thread.id, nuance, index)}
                                                className="bg-fuchsia-500 text-white text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-fuchsia-600 transition-colors shadow-lg shadow-fuchsia-500/20"
                                              >
                                                  {hasContent ? 'Edit Workshop' : 'Open Workshop'} &rarr;
                                              </button>
                                          </div>
                                        </div>
                                    </details>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuidancePanel;