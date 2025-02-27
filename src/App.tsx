import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Database, Send } from 'lucide-react';
import ConfigForm from './components/ConfigForm';
import FileUploader from './components/FileUploader';
import DataPreview from './components/DataPreview';
import SendDataButton from './components/SendDataButton';
import { NewRelicConfig, FileData } from './types';
import feedrelic from './images/feedrelic.png'
import footerimg from './images/footerimage.png'

function App() {
  const [config, setConfig] = useState<NewRelicConfig | null>(null);
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const [fileData, setFileData] = useState<FileData | null>(null);

  const handleConfigSubmit = (newConfig: NewRelicConfig) => {
    setConfig(newConfig);
    setIsConfigSaved(true);
    toast.success('New Relic configuration saved!');
  };

  const handleFileProcessed = (data: FileData) => {
    setFileData(data);
    toast.success(`File "${data.fileName}" processed successfully!`);
  };

  const handleSendComplete = (success: boolean, message: string) => {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* <Database className="h-8 w-8 text-blue-600 mr-3" /> */}
            <img src= {feedrelic} alt="FeedRelic Logo" className="h-auto w-[300px] mr-3" />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Send Custom Event Eata To New Relic Database
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <ConfigForm 
              onConfigSubmit={handleConfigSubmit} 
              isConfigSaved={isConfigSaved} 
            />
            
            <div className="mt-8">
              <FileUploader 
                onFileProcessed={handleFileProcessed} 
                disabled={!isConfigSaved} 
              />
            </div>
          </div>
          
          <div>
            <DataPreview fileData={fileData} />
            
            {fileData && (
              <div className="mt-8">
                <SendDataButton 
                  config={config} 
                  fileData={fileData} 
                  onSendComplete={handleSendComplete} 
                />
              </div>
            )}
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Send className="mr-2 h-5 w-5 text-blue-500" />
                How It Works
              </h2>
              
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Select your region (US or EU) and enter your New Relic Account ID</li>
                <li>Enter your New Relic Insights Insert API Key</li>
                <li>Type a event name where you want to store your data inside New Relic</li>
                <li>Upload a CSV or Excel file containing your event data</li>
                <li>Review the data preview to ensure it looks correct</li>
                <li>Click "Send Data to New Relic" to transmit the events</li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your data is processed entirely in your browser. 
                  No data is stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-center">
          <img src={footerimg} alt="New Relic Data Sender Logo" className="h-8" />
        </div>
    </footer>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;