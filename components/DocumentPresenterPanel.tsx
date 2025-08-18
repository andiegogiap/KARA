
import React from 'react';
import { Nuance } from '../types';
import DocumentCard from './DocumentCard';

const CloseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const PrintIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0c1.253 0 2.266-.934 2.266-2.093v-2.612a2.25 2.25 0 0 0-2.266-2.25H6.342a2.25 2.25 0 0 0-2.266 2.25v2.612c0 1.159 1.013 2.093 2.266 2.093m11.318 0a2.25 2.25 0 0 0 2.266-2.25v-2.612a2.25 2.25 0 0 0-2.266-2.25H6.342a2.25 2.25 0 0 0-2.266 2.25v2.612c0 1.159 1.013 2.093 2.266 2.093m0 0v-2.612a2.25 2.25 0 0 0-2.266-2.25H6.342a2.25 2.25 0 0 0-2.266 2.25v2.612a2.25 2.25 0 0 0 2.266-2.25m0 0h11.318" />
    </svg>
);


interface DocumentPresenterPanelProps {
    nuance: Nuance;
    onClose: () => void;
}

const DocumentPresenterPanel: React.FC<DocumentPresenterPanelProps> = ({ nuance, onClose }) => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-end p-4 z-50 animate-fade-in" 
            onClick={onClose}
        >
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up-panel { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>
            
            <div id="document-presenter" className="w-full max-w-4xl mx-auto animate-slide-up-panel" onClick={(e) => e.stopPropagation()}>
                <header className="bg-gray-800 rounded-t-lg p-3 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Generated UI/UX Document</h3>
                    <div className="flex items-center gap-4">
                         <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 text-sm text-cyan-300 hover:text-white transition-colors"
                        >
                            <PrintIcon className="w-5 h-5"/>
                            Print Document
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full" aria-label="Close document">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                <div className="max-h-[75vh] overflow-y-auto bg-gray-200 p-4 rounded-b-lg">
                    <DocumentCard nuance={nuance} />
                </div>
            </div>
        </div>
    );
};

export default DocumentPresenterPanel;
