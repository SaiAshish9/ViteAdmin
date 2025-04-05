declare module "react-speech-recognition" {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    language?: string;
    interimResults?: boolean;
  }

  export interface SpeechRecognitionListenOptions
    extends SpeechRecognitionOptions {
    abortTranscript?: boolean;
  }

  export interface SpeechRecognitionHookResult {
    transcript: string;
    finalTranscript: string;
    interimTranscript: string;
    resetTranscript: () => void;
    listening: boolean;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }

  const SpeechRecognition: {
    startListening: (options?: SpeechRecognitionListenOptions) => void;
    stopListening: () => void;
    abortListening: () => void;
    getRecognition: () => unknown | null;
    browserSupportsSpeechRecognition: boolean;
    browserSupportsContinuousListening: boolean;
  };

  export default SpeechRecognition;

  export function useSpeechRecognition(options?: {
    transcribing?: boolean;
    clearTranscriptOnListen?: boolean;
    commands?: {
      command: string | string[] | RegExp;
      callback: (...args: unknown[]) => void;
      matchInterim?: boolean;
      fuzzyMatch?: boolean;
      isFuzzyMatch?: boolean;
      bestMatchOnly?: boolean;
    }[];
  }): SpeechRecognitionHookResult;
}
