'use client';

import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

interface CsvUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function CsvUpload({ onFileSelect, isLoading = false }: CsvUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Accept both .csv files and check extension as fallback
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid CSV file');
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Accept both .csv files and check extension as fallback
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Please drop a valid CSV file');
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Running Data</CardTitle>
        <CardDescription>
          Upload a CSV file with columns: date, person, miles run
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your CSV file here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Accepts .csv files only
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          style={{ display: 'none' }}
        />

        {selectedFile && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Processing...' : 'Analyze Data'}
        </Button>
      </CardContent>
    </Card>
  );
}