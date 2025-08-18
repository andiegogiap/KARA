
import React, { useState, useEffect } from 'react';
import { Nuance } from '../types';
import { getWorkshopEnhancement } from '../services/geminiService';

interface WorkshopFieldProps {
  fieldName: string;
  label: string;
  value: string;
  nuanceTitle: string;
  onChange: (value: string) => void;
  onGenerate: (fieldName: string, content: string) => Promise<void>;
  isLoading: boolean;
  error: string;
}

const WorkshopField: React.FC<WorkshopFieldProps> = ({ fieldName, label, value, nuanceTitle, onChange, onGenerate, isLoading, error }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={fieldName} className="text-lg font-semibold text-gray-200">{label}</label>
        <button
          onClick={() => onGenerate(fieldName, value)}
          disabled={isLoading}
          className="bg-cyan-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-cyan-600 transition-colors disabled:bg-gray-600 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Generating...
            </>
          ) : (
            '✨ Generate Suggestions'
          )}
        </button>
      </div>
      <textarea
        id={fieldName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-48 bg-gray-900/80 border border-gray-700 rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        placeholder={`Enter details for ${label}...`}
      />
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};


interface WorkshopViewProps {
  workshopState: {
    threadId: string;
    nuance: Nuance;
    nuanceIndex: number;
  };
  onSaveAndClose: (threadId: string, nuanceIndex: number, workshopContent: Record<string, string>) => void;
}

const WorkshopView: React.FC<WorkshopViewProps> = ({ workshopState, onSaveAndClose }) => {
  const { threadId, nuance, nuanceIndex } = workshopState;
  const [formData, setFormData] = useState<Record<string, string>>({
    keyObjectives: '',
    actionSteps: '',
    successMetrics: '',
  });
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      keyObjectives: nuance.workshopContent?.keyObjectives || '',
      actionSteps: nuance.workshopContent?.actionSteps || '',
      successMetrics: nuance.workshopContent?.successMetrics || '',
    });
  }, [nuance]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerate = async (fieldName: string, content: string) => {
    setLoadingFields(prev => ({ ...prev, [fieldName]: true }));
    setFieldErrors(prev => ({...prev, [fieldName]: ''}));
    const result = await getWorkshopEnhancement(nuance.title, fieldName, content);
    if ('error' in result) {
        setFieldErrors(prev => ({...prev, [fieldName]: result.error}));
    } else {
        setFormData(prev => ({ ...prev, [fieldName]: result.suggestion }));
    }
    setLoadingFields(prev => ({ ...prev, [fieldName]: false }));
  };
  
  const handleSave = () => {
    onSaveAndClose(threadId, nuanceIndex, formData);
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl p-6 lg:p-8 animate-fade-in">
        <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-700 mb-6">
            <div>
                <span className="text-fuchsia-400 font-semibold text-sm">Workshop</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">{nuance.title}</h2>
                <p className="text-gray-400 mt-2 max-w-2xl">{nuance.detail}</p>
            </div>
            <button
                onClick={handleSave}
                className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 shrink-0"
            >
                Save & Close Workshop
            </button>
        </header>

        <main className="space-y-8">
            <WorkshopField
                fieldName="keyObjectives"
                label="Key Objectives"
                value={formData.keyObjectives}
                nuanceTitle={nuance.title}
                onChange={(val) => handleFieldChange('keyObjectives', val)}
                onGenerate={handleGenerate}
                isLoading={loadingFields.keyObjectives}
                error={fieldErrors.keyObjectives}
            />
            <WorkshopField
                fieldName="actionSteps"
                label="Action Steps"
                value={formData.actionSteps}
                nuanceTitle={nuance.title}
                onChange={(val) => handleFieldChange('actionSteps', val)}
                onGenerate={handleGenerate}
                isLoading={loadingFields.actionSteps}
                error={fieldErrors.actionSteps}
            />
            <WorkshopField
                fieldName="successMetrics"
                label="Success Metrics"
                value={formData.successMetrics}
                nuanceTitle={nuance.title}
                onChange={(val) => handleFieldChange('successMetrics', val)}
                onGenerate={handleGenerate}
                isLoading={loadingFields.successMetrics}
                error={fieldErrors.successMetrics}
            />
        </main>
    </div>
  );
};

export default WorkshopView;