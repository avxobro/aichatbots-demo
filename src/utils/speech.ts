// Check if the browser supports the Web Speech API
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Speak text using the Web Speech API
export const speakText = (text: string): void => {
  if (!isSpeechSynthesisSupported()) {
    console.error('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Optional: Configure the voice
  // const voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices[0]; // Choose a voice

  // Optional: Configure other properties
  utterance.rate = 1.0; // Speed: 0.1 to 10
  utterance.pitch = 1.0; // Pitch: 0 to 2
  utterance.volume = 1.0; // Volume: 0 to 1

  window.speechSynthesis.speak(utterance);
};
