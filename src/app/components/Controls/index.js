import React from 'react';

const EditControls = ({ onEdit, onNew, onSave, isEditing, onUpgrade, isPremium }) => (
  <div className="p-4 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <button
        onClick={onEdit}
        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        Edit PDF
      </button>
      <button
        onClick={onNew}
        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        New PDF
      </button>
      {isEditing && (
        <button
          onClick={onSave}
          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
        >
          Save as PDF
        </button>
      )}
    </div>
    {!isPremium && (
      <button
        onClick={onUpgrade}
        className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
      >
        Upgrade for More Features
      </button>
    )}
  </div>
);

export default EditControls; 