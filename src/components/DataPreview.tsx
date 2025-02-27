import React, { useState } from 'react';
import { Table, Eye, EyeOff } from 'lucide-react';
import { FileData } from '../types';

interface DataPreviewProps {
  fileData: FileData | null;
}

const DataPreview: React.FC<DataPreviewProps> = ({ fileData }) => {
  const [showPreview, setShowPreview] = useState(true);
  
  if (!fileData || !fileData.data.length) {
    return null;
  }
  
  const headers = Object.keys(fileData.data[0]);
  const previewData = fileData.data.slice(0, 5); // Show only first 5 rows
  const totalRows = fileData.data.length;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Table className="mr-2 h-5 w-5 text-blue-500" />
          Data Preview
        </h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show Preview
            </>
          )}
        </button>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{fileData.fileName} • </span>  
          {totalRows} row{totalRows !== 1 ? 's' : ''} • {headers.length} column{headers.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {showPreview && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header) => (
                    <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row[header]?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalRows > 5 && (
            <p className="mt-3 text-sm text-gray-500 italic">
              Showing 5 of {totalRows} rows
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DataPreview;