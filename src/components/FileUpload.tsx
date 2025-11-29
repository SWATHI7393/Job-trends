"use client";

import { cn } from "@/lib/utils";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  className?: string;
}

export default function FileUpload({ onFileUpload, className }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors duration-300",
        "hover:border-primary hover:bg-secondary",
        isDragActive ? "border-primary bg-secondary" : "border-border",
        className
      )}
    >
      <input {...getInputProps()} />
      {uploadedFile ? (
        <div className="flex flex-col items-center gap-4 text-green-600 dark:text-green-400">
          <CheckCircle size={48} />
          <div className="text-center">
            <p className="font-semibold text-lg">{uploadedFile.name}</p>
            <p className="text-sm">File ready for analysis.</p>
          </div>
          <p className="text-muted-foreground text-xs mt-2">Drop another file to replace.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <UploadCloud size={48} className={isDragActive ? "text-primary" : ""} />
          <div className="text-center">
            <p className="font-semibold text-lg">
              {isDragActive ? "Drop the file here..." : "Drag & drop your resume"}
            </p>
            <p className="text-sm">or click to browse</p>
          </div>
          <p className="text-xs mt-2">PDF, DOC, DOCX up to 10MB</p>
        </div>
      )}
    </div>
  );
}
