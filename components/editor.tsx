"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { FileService } from "@/services/file.service";
import { useEffect } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: any;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const handleUpload = async (file: File) => {
    try {
      const res = await FileService.uploadImage(file);
      return res.url;
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const editor = useCreateBlockNote({
    uploadFile: handleUpload,
  });
  useEffect(() => {
    if (!initialContent) return;
    async function loadInitialHTML() {
      const blocks = await editor.tryParseHTMLToBlocks(initialContent);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor]);
  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const onEditorChange = async () => {
    const markdown = await editor.blocksToHTMLLossy(editor.document);
    onChange(markdown);
  };

  return (
    <div>
      <BlockNoteView
        editable={editable}
        onChange={onEditorChange}
        editor={editor}
        theme={"light"}
      />
    </div>
  );
};

export default Editor;
