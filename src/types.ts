export interface NewRelicConfig {
  region: 'US' | 'EU';
  accountId: string;
  apiKey: string;
  eventName: string;
  insightsApiUrl: string;
}

export interface FileData {
  data: Record<string, any>[];
  fileName: string;
  fileType: string;
}