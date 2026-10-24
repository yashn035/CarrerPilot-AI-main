import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Loader2, Code2 } from 'lucide-react';

const LANGUAGE_VERSIONS = [
  { id: 'javascript', label: 'JavaScript (Node.js v18)' },
  { id: 'python', label: 'Python 3.10' },
  { id: 'java', label: 'Java 15' },
  { id: 'cpp', label: 'C++ 17' }
];

export default function EditorPanel({
  language,
  setLanguage,
  code,
  setCode,
  onRun,
  onSubmit,
  running,
  submitting,
  compileError
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case 'python': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Set red squiggle marker for compilation errors with line numbers
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const monaco = monacoRef.current;
      const model = editorRef.current.getModel();
      
      if (compileError?.line && model) {
        const lineNum = Math.min(compileError.line, model.getLineCount());
        monaco.editor.setModelMarkers(model, 'compiler', [
          {
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: 100,
            message: compileError.message || 'Compilation Error',
            severity: monaco.MarkerSeverity.Error
          }
        ]);
      } else if (model) {
        monaco.editor.setModelMarkers(model, 'compiler', []);
      }
    }
  }, [compileError]);

  return (
    <div className="flex flex-col h-full bg-[#111118] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#14141f] border-b border-gray-800/80">
        
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none font-semibold cursor-pointer transition-colors"
          >
            {LANGUAGE_VERSIONS.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-[#181824]">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={running || submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#181824] hover:bg-gray-800 border border-gray-800 text-white transition-all disabled:opacity-50"
          >
            {running ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            )}
            <span>Run Code</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={running || submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[380px] relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            fontFamily: "'Fira Code', 'Courier New', monospace"
          }}
        />
      </div>
    </div>
  );
}
