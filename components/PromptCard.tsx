
import React from 'react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(prompt)}
      className="group glass neon p-6 transition-all duration-300 cursor-pointer hover:shadow-cyan-400/20 hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100 tracking-tight">{prompt.title}</h2>
          <span className="bg-fuchsia-900/50 text-fuchsia-300 text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center border-2 border-fuchsia-500 shadow-sm">
            {prompt.value}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{prompt.description}</p>
      </div>
      <div className="mt-6 text-right">
        <span className="text-sm font-medium text-cyan-400 group-hover:text-white transition-colors">
          Explore &rarr;
        </span>
      </div>
    </div>
  );
};

export default PromptCard;