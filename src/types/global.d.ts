/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/types/global.d.ts

// Baris ini penting untuk memastikan file ini diperlakukan sebagai modul
export {};

declare global {
  // Mendefinisikan tipe untuk event yang dihasilkan oleh SpeechRecognition
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  // Mendefinisikan tipe untuk daftar hasil
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  // Mendefinisikan tipe untuk satu hasil tunggal
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  // Mendefinisikan tipe untuk alternatif transkrip
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  // Mendefinisikan tipe untuk event error
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  // Mendefinisikan interface utama untuk SpeechRecognition itu sendiri
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    start(): void;
    stop(): void;
  }

  // Mendefinisikan konstruktornya pada objek Window
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}