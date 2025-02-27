import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, FileX } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FileData } from '../types';

interface FileUploaderProps {
  onFileProcessed: (fileData: FileData) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed, disabled }) => {
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
          return;
        }
        
        onFileProcessed({
          data: results.data as Record<string, any>[],
          fileName: file.name,
          fileType: 'csv'
        });
        
        setFileInfo({ name: file.name, type: 'CSV' });
        setError(null);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
      }
    });
  };

  const processExcel = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        onFileProcessed({
          data: jsonData as Record<string, any>[],
          fileName: file.name,
          fileType: 'excel'
        });
        
        setFileInfo({ name: file.name, type: 'Excel' });
        setError(null);
      } catch (err) {
        setError(`Error parsing Excel file: ${(err as Error).message}`);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsBinaryString(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setError(null);
    
    if (file.type === 'text/csv') {
      processCSV(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.type === 'application/vnd.ms-excel'
    ) {
      processExcel(file);
    } else {
      setError('Please upload a CSV or Excel file');
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    disabled: disabled,
    maxFiles: 1
  });

  const resetFile = () => {
    setFileInfo(null);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileSpreadsheet className="mr-2 h-5 w-5 text-blue-500" />
        Upload Data File
      </h2>
      
      {disabled && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          Please save your New Relic configuration first.
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {fileInfo ? (
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">{fileInfo.name}</p>
                <p className="text-sm text-gray-500">{fileInfo.type} file</p>
              </div>
            </div>
            <button 
              onClick={resetFile}
              className="text-red-500 hover:text-red-700"
              title="Remove file"
            >
              <FileX className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-blue-500 mb-3" />
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports CSV, XLS, and XLSX files
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;