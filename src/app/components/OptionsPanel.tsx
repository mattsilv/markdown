'use client';

interface OptionsPanelProps {
  fixEscapes: boolean;
  smartLists: boolean;
  processFootnotes: boolean;
  onFixEscapesChange: (checked: boolean) => void;
  onSmartListsChange: (checked: boolean) => void;
  onProcessFootnotesChange: (checked: boolean) => void;
}

export default function OptionsPanel({
  fixEscapes,
  smartLists,
  processFootnotes,
  onFixEscapesChange,
  onSmartListsChange,
  onProcessFootnotesChange
}: OptionsPanelProps) {
  return (
    <div className="options-panel bg-gray-50 border border-gray-200 rounded p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Formatting Options</h3>
      <div className="options-group grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="option-item flex items-center">
          <input 
            type="checkbox" 
            id="fix-escapes" 
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            checked={fixEscapes}
            onChange={(e) => onFixEscapesChange(e.target.checked)}
          />
          <label htmlFor="fix-escapes" className="text-sm">Fix escaped characters (\.)</label>
        </div>
        
        <div className="option-item flex items-center">
          <input 
            type="checkbox" 
            id="smart-lists" 
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            checked={smartLists}
            onChange={(e) => onSmartListsChange(e.target.checked)}
          />
          <label htmlFor="smart-lists" className="text-sm">Smart lists</label>
        </div>
        
        <div className="option-item flex items-center">
          <input 
            type="checkbox" 
            id="process-footnotes" 
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            checked={processFootnotes}
            onChange={(e) => onProcessFootnotesChange(e.target.checked)}
          />
          <label htmlFor="process-footnotes" className="text-sm">Process footnotes ([^1])</label>
        </div>
      </div>
    </div>
  );
}