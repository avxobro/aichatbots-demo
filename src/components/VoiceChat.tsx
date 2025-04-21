import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Message, VoiceChatState } from '@/types';
import { speakText, isSpeechSynthesisSupported } from '@/utils/speech';

export default function VoiceChat() {
  const [chatState, setChatState] = useState<VoiceChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isRecording: false,
    transcript: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setChatState(prev => ({ ...prev, isRecording: true, transcript: '' }));
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Could not access microphone. Please check permissions.',
        isRecording: false,
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && chatState.isRecording) {
      mediaRecorderRef.current.stop();
      setChatState(prev => ({ ...prev, isRecording: false }));

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setChatState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // Send the audio to our transcription API
      const response = await axios.post('/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { transcript } = response.data;

      if (!transcript) {
        throw new Error('No transcript returned');
      }

      setChatState(prev => ({ ...prev, transcript }));

      // Send the transcript to the AI
      await sendMessageToAI(transcript);

    } catch (error) {
      console.error('Error processing audio:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process audio. Please try again.',
      }));
    }
  };

  const sendMessageToAI = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await axios.post('/api/chat', {
        messages: [...chatState.messages, userMessage],
      });

      const assistantMessage: Message = response.data.choices[0].message;

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        transcript: '',
      }));

      // Text-to-speech
      speakText(assistantMessage.content);

    } catch (error) {
      console.error('Error sending message:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get AI response. Please try again.',
      }));
    }
  };

  useEffect(() => {
    if (!isSpeechSynthesisSupported()) {
      setChatState(prev => ({
        ...prev,
        error: 'Text-to-speech is not supported in your browser. You will only see text responses.'
      }));
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Voice Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Click the microphone button to start speaking
          </div>
        )}

        {chatState.messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[90%] sm:max-w-[80%] break-words ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100'
            }`}
          >
            <p className="text-sm sm:text-base">{message.content}</p>
          </div>
        ))}

        {chatState.transcript && (
          <div className="p-3 rounded-lg bg-blue-50 max-w-[90%] sm:max-w-[80%] ml-auto border border-blue-200 break-words">
            <p className="italic text-sm sm:text-base">{chatState.transcript}</p>
          </div>
        )}

        {chatState.isLoading && (
          <div className="p-3 rounded-lg bg-gray-100 max-w-[90%] sm:max-w-[80%] break-words">
            <p className="text-sm sm:text-base">Processing...</p>
          </div>
        )}

        {chatState.error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 max-w-[90%] sm:max-w-[80%] break-words">
            <p className="text-sm sm:text-base">{chatState.error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <button
          onClick={chatState.isRecording ? stopRecording : startRecording}
          className={`w-full p-3 sm:p-4 rounded-lg flex items-center justify-center ${
            chatState.isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300`}
          disabled={chatState.isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <span className="text-sm sm:text-base">
            {chatState.isRecording ? 'Stop Recording' : 'Start Recording'}
          </span>
        </button>
      </div>
    </div>
  );
}
