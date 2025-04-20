import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const MCPInterface = ({ onApplyCommand, onGenerateFromText, generatedCommands, setGeneratedCommands }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Here we'll integrate with the AI agent to generate commands
      // For now, we'll simulate it with some example commands
      const commands = [
        { type: 'rectangle', x: 100, y: 100, width: 200, height: 100 },
        { type: 'ellipse', x: 400, y: 100, width: 150, height: 150 },
        { type: 'diamond', x: 300, y: 300, width: 200, height: 100 }
      ];
      
      setGeneratedCommands(commands);
      toast.success('Commands generated successfully!');
    } catch (error) {
      console.error('Error generating commands:', error);
      toast.error('Failed to generate commands');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold mb-4">Diagram Controls</h3>
        
        <div className="space-y-4">
          <button
            onClick={onGenerateFromText}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Generate from Selected Text
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Or Enter a Prompt
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the diagram you want to create..."
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
              <button
                onClick={handleGenerateFromPrompt}
                disabled={isGenerating}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50 text-sm"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {generatedCommands.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Commands</h3>
          <div className="space-y-2">
            {generatedCommands.map((command, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm">
                  {command.type} at ({command.x}, {command.y})
                </span>
                <button
                  onClick={() => onApplyCommand(command)}
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPInterface; 