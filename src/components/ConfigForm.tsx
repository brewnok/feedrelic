import React, { useState, useEffect } from 'react';
import { Key, Globe } from 'lucide-react';
import { NewRelicConfig } from '../types';

interface ConfigFormProps {
  onConfigSubmit: (config: NewRelicConfig) => void;
  isConfigSaved: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ onConfigSubmit, isConfigSaved }) => {
  const [config, setConfig] = useState<NewRelicConfig>({
    region: 'US',
    accountId: '',
    apiKey: '',
    eventName: '',
    insightsApiUrl: ''
  });

  // Generate the Insights API URL based on region and account ID
  useEffect(() => {
    if (config.accountId) {
      const baseUrl = config.region === 'US' 
        ? 'https://insights-collector.newrelic.com/v1/accounts/' 
        : 'https://insights-collector.eu01.nr-data.net/v1/accounts/';
      
      setConfig(prev => ({
        ...prev,
        insightsApiUrl: `${baseUrl}${config.accountId}/events`
      }));
    }
  }, [config.region, config.accountId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSubmit(config);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Key className="mr-2 h-5 w-5 text-blue-500" />
        New Relic Configuration
      </h2>
      
      {isConfigSaved && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Configuration saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <div className="flex items-center">
            {/* <Globe className="h-5 w-5 text-gray-400 mr-2" /> */}
            <select
              id="region"
              name="region"
              value={config.region}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="US">United States (US)</option>
              <option value="EU">European Union (EU)</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">
            New Relic Account ID
          </label>
          <input
            type="text"
            id="accountId"
            name="accountId"
            value={config.accountId}
            onChange={handleChange}
            placeholder="Your New Relic Account ID"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="insightsApiUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Insights API URL (Auto-generated)
          </label>
          <input
            type="text"
            id="insightsApiUrl"
            name="insightsApiUrl"
            value={config.insightsApiUrl}
            readOnly
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This URL is automatically generated based on your region and account ID
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            value={config.apiKey}
            onChange={handleChange}
            placeholder="Your New Relic Insights Insert API Key"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={config.eventName}
            onChange={handleChange}
            placeholder="CustomEvent"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            The name of the event type in New Relic
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default ConfigForm;