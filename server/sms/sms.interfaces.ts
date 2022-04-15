export interface SmsModuleOptions {
  apiKey: string;
}

export interface SmsSubmitData {
  text: string;
  to: string;
  from?: string;
}
