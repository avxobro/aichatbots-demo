export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface VoiceChatState extends ChatState {
  isRecording: boolean;
  transcript: string;
}
