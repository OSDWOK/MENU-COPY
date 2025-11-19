export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: (string | FormFieldOption)[];
  readonly?: boolean;
  description?: string;
  default?: any;
  validation?: {
    pattern: string;
    message: string;
  };
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string without prefix
}

export interface FormData {
  [key: string]: any;
}

export interface CookbookEntry {
  category: string;
  ingredients: string[];
}

export interface Cookbook {
  [dishName: string]: CookbookEntry;
}

export interface GeminiResponse {
  descricao: string;
  keywords: string[];
  emojis: string[];
  fonte: string;
  canal: string;
}

// FIX: Add Message and Sender types for Chat components
export enum Sender {
  Bot = 'bot',
  User = 'user',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export interface ApprovedVersion {
  descricao: string;
  keywords: string[];
  emojis: string[];
}

export interface ApprovedVersionsStore {
  [itemName: string]: { // dish or category name
    [channel: string]: ApprovedVersion;
  };
}
