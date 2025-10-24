"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function CareerObjectiveEditor({ value, onChange }: Props) {
  const [editorValue, setEditorValue] = useState<string>("");

  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(val) => {
          setEditorValue(val);
          onChange(val);
        }}
      />
    </div>
  );
}
