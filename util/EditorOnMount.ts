import { Monaco } from "@monaco-editor/react";

export default function handleEditorWillMount(monacoInstance: Monaco) {
  // Disable JavaScript validation
  monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  });

  // Disable TypeScript validation
  monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  });

  // Optional: disable all markers for any language
  monacoInstance.editor.onDidCreateModel((model: any) => {
    monacoInstance.editor.setModelMarkers(model, 'owner', []);
  });
}