import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { type editor as monacoEditor } from 'monaco-editor';
import { Button } from '@/components/ui/button';

interface CodeViewerProps {
  fileContent: string | null;
  filename: string | null;
  lineNumbers?: boolean;
  language?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  fileContent,
  filename,
  lineNumbers = true,
  language = 'javascript',
}) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  
  const handleEditorMount = (editor: monacoEditor.IStandaloneCodeEditor) => {
    // Add click event listener
    editor.onMouseDown((e) => {
      if (e.target.position) {
        console.log("Mouse down at line:", e.target.position.lineNumber);
        setSelectedLine(e.target.position.lineNumber);
      }
    });

    // Alternative: Listen for selection changes
    editor.onDidChangeCursorSelection(() => {
      const position = editor.getPosition();
      if (position) {
        console.log("Selection changed to line:", position.lineNumber);
        setSelectedLine(position.lineNumber);
      }
    });
  };

  return (
    <div className="relative">
      <style>
        {`
          .monaco-editor .monaco-editor-background:hover,
          .monaco-editor .margin:hover,
          .monaco-editor .lines-content:hover,
          .monaco-editor .view-line:hover {
            cursor: pointer !important;
          }
        `}
      </style>
      <Editor
        height="40vh"
        language={language}
        value={fileContent ?? ''}
        options={{
          selectOnLineNumbers: true,
          readOnly: true,
          lineNumbers: lineNumbers ? "on" : "off",
          automaticLayout: true,
          minimap: { enabled: false },
          renderLineHighlight: 'all',
          scrollBeyondLastLine: false,
          cursorStyle: "block"
        }}
        onMount={handleEditorMount}
      />
      {selectedLine !== null && (
        <div className="absolute bottom-0 right-6 shadow-lg rounded">
          <Button
          variant="outline"
            onClick={() => console.log(`Button clicked for line ${selectedLine}`)}
          >
            Ask on line {selectedLine}
          </Button>
        </div>
      )}
    </div>
  );
};