import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { PYTHON_PROJECT_FILES } from '../data/pythonFiles';

export const PythonCodeViewer: React.FC = () => {
  const [activeFilename, setActiveFilename] = useState<string>('main.py');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const selectedFile =
    PYTHON_PROJECT_FILES.find((f) => f.filename === activeFilename) ||
    PYTHON_PROJECT_FILES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(selectedFile.filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-sky-200/90 bg-white text-slate-800 shadow-xs">
      <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-50 px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-sky-200">
        <div>
          <h2 className="text-sm font-display font-bold tracking-tight text-slate-800">
            Clean, Commented Python Source Code (Classes & Functions)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PYTHON_PROJECT_FILES.map((file) => {
            const isActive = file.filename === selectedFile.filename;
            return (
              <button
                key={file.filename}
                type="button"
                onClick={() => setActiveFilename(file.filename)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 font-bold'
                    : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
                }`}
              >
                <FileCode size={12} />
                <span>{file.filename}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleCopy}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors"
          >
            {copiedFile === selectedFile.filename ? (
              <>
                <Check size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy {selectedFile.filename}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600">
        <span>{selectedFile.description}</span>
        <span className="text-sky-700 font-semibold">{selectedFile.path}</span>
      </div>

      <pre className="max-h-[520px] overflow-auto bg-[#FAFCFF] text-slate-800 p-5 font-mono text-xs leading-relaxed">
        {selectedFile.content}
      </pre>
    </div>
  );
};
