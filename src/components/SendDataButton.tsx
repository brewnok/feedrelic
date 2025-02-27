import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { NewRelicConfig, FileData } from '../types';

interface SendDataButtonProps {
  config: NewRelicConfig | null;
  fileData: FileData | null;
  onSendComplete: (success: boolean, message: string) => void;
}

const SendDataButton: React.FC<SendDataButtonProps> = ({ config, fileData, onSendComplete }) => {
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const isDisabled = !config || !fileData || isSending;
  
  const sendDataToNewRelic = async () => {
    if (!config || !fileData || !fileData.data.length) return;
    
    setIsSending(true);
    setProgress(0);
    
    const totalItems = fileData.data.length;
    let successCount = 0;
    let errorCount = 0;
    
    try {
      // Process in batches of 100 to avoid overwhelming the API
      const batchSize = 100;
      const batches = Math.ceil(totalItems / batchSize);
      
      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, totalItems);
        const batch = fileData.data.slice(start, end);
        
        // Prepare the batch for New Relic
        const events = batch.map(item => ({
          eventType: config.eventName,
          ...item
        }));
        
        try {
          // Send data to New Relic
          const response = await fetch(config.insightsApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Insert-Key': config.apiKey
            },
            body: JSON.stringify(events)
          });
          
          if (response.ok) {
            successCount += batch.length;
          } else {
            const errorText = await response.text();
            console.error('New Relic API error:', errorText);
            errorCount += batch.length;
          }
        } catch (error) {
          console.error('Error sending batch to New Relic:', error);
          errorCount += batch.length;
        }
        
        // Update progress
        setProgress(Math.round(((i + 1) / batches) * 100));
      }
      
      // Report results
      if (errorCount === 0) {
        onSendComplete(true, `Successfully sent ${successCount} records to New Relic.`);
      } else if (successCount === 0) {
        onSendComplete(false, `Failed to send all ${totalItems} records to New Relic.`);
      } else {
        onSendComplete(
          true,
          `Partially successful: Sent ${successCount} records, failed to send ${errorCount} records.`
        );
      }
    } catch (error) {
      console.error('Error in send process:', error);
      onSendComplete(false, `Error: ${(error as Error).message}`);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <button
        onClick={sendDataToNewRelic}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 transition-colors'
        }`}
      >
        {isSending ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Sending Data ({progress}%)
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Data to New Relic
          </>
        )}
      </button>
      
      {!config && (
        <p className="mt-2 text-sm text-red-500">
          Please configure New Relic settings first.
        </p>
      )}
      
      {!fileData && (
        <p className="mt-2 text-sm text-red-500">
          Please upload a data file first.
        </p>
      )}
    </div>
  );
};

export default SendDataButton;