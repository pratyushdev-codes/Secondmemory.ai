import React, { useState } from 'react';
import { Upload, Download, Copy, Trash2 } from 'lucide-react';

const EditorToolbar = ({ onFileUpload, onClear, editorContent }) => {
  const [selectedButton, setSelectedButton] = useState('Code');

  const getButtonClasses = (button) => {
    const isActive = selectedButton === button;
    return `flex items-center gap-2 px-3  rounded-xl transition-colors duration-200 ${
      isActive ? 'bg-[#0F1A23] text-[#2995E5]' : 'hover:bg-gray-800/50 text-gray-300'
    }`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editorContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 glass-container  bg-[#171717] border-b border-gray-800/50">
      <div className="flex items-center gap-2 py-1.5  px-3 bg-[#0A0A0A] rounded-full">
        <button
          className={getButtonClasses('Code')}
          onClick={() => setSelectedButton('Code')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M600-40q-33 0-56.5-23.5T520-120q0-23 11-41t29-29v-221q-18-11-29-28.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 23-11 40.5T640-411v115l160-53v-62q-18-11-29-28.5T760-480q0-33 23.5-56.5T840-560q33 0 56.5 23.5T920-480q0 23-11 40.5T880-411v119l-240 80v22q18 11 29 29t11 41q0 33-23.5 56.5T600-40ZM160-160v-560 560Zm0 0q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480h280v80H160Z" />
          </svg>
          <span>Code</span>
        </button>
        <label
          className={getButtonClasses('Upload')}
          onClick={() => setSelectedButton('Upload')}
        >
         <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/></svg>
          <span>Upload</span>
          <input
            type="file"
            accept=".js,.jsx,.ts,.tsx,.txt,.py, .cpp ,.c,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <button
          className={getButtonClasses('Download')}
          onClick={() => {
            setSelectedButton('Download');
            handleDownload();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
          <span>Download</span>
        </button>
        <button
          className={getButtonClasses('Copy')}
          onClick={() => setSelectedButton('Copy')}
        >
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </button>
      </div>
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-800/50 transition-colors duration-200 text-red-400 hover:text-red-300"
      >
        <Trash2 className="w-4 h-4" />
        <span>Clear</span>
      </button>
    </div>
  );
};

export default EditorToolbar;
