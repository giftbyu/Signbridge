/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from 'next/image';
import { FaVideo, FaStopCircle, FaEraser, FaMicrophone, FaMicrophoneSlash, FaCog } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver, DrawingUtils, NormalizedLandmark } from "@mediapipe/tasks-vision";
import LoadingScreen from '@/components/LoadingPage';

const HAND_CONNECTIONS = [
  { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 }, // Thumb
  { start: 0, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 8 }, // Index Finger
  { start: 5, end: 9 }, { start: 9, end: 10 }, { start: 10, end: 11 }, { start: 11, end: 12 }, // Middle Finger
  { start: 9, end: 13 }, { start: 13, end: 14 }, { start: 14, end: 15 }, { start: 15, end: 16 }, // Ring Finger
  { start: 13, end: 17 }, { start: 17, end: 18 }, { start: 18, end: 19 }, { start: 19, end: 20 }, // Pinky
  { start: 0, end: 17 }
];

type Landmark = { x: number; y: number; z: number; visibility?: number };

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const lastPredictionRef = useRef("");
  const predictionCountRef = useRef(0);
  
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [predictionResult, setPredictionResult] = useState("");
  const [suggestionResult, setSuggestionResult] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechApiAvailable, setIsSpeechApiAvailable] = useState(false);
  const [dictionary, setDictionary] = useState<string[]>([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);

  const PREDICTION_THRESHOLD = 5;
  
  const videoStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    isDetectingRef.current = isDetecting;
  }, [isDetecting]);

  useEffect(() => {
    if (isLoading) return;

    async function setupApis() {
      try {
        const response = await fetch('/kamus.json');
        if (!response.ok) throw new Error('Gagal memuat kamus');
        const data = await response.json();
        setDictionary(data);
      } catch (err) {
        console.error("Gagal memuat kamus.json:", err);
      }
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO", numHands: 2,
        });
        handLandmarkerRef.current = handLandmarker;
        setIsModelLoading(false);
        requestAnimationFrame(visualLoop);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Terjadi error tidak dikenal.";
        setError(`Gagal memuat model: ${errorMessage}`);
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechApiAvailable(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'id-ID';
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let final_transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            }
          }
          if (final_transcript) {
            setPredictionResult(prev => (prev ? prev + ' ' : '') + final_transcript.trim());
          }
        };
        recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
        speechRecognitionRef.current = recognition;
      }
    }
    setupApis();
  }, [isLoading]);

  useEffect(() => {
    if (predictionResult.length === 0 || dictionary.length === 0) {
      setSuggestionResult([]); return;
    }
    const words = predictionResult.trim().split(' ');
    const currentWord = words[words.length - 1];
    if (currentWord.length >= 0) {
      const suggestions = dictionary.filter(dictWord => 
        dictWord.length >= 2 && dictWord.toLowerCase().startsWith(currentWord.toLowerCase())
      ).slice(0, 5);
      setSuggestionResult(suggestions);
    } else {
      setSuggestionResult([]);
    }
  }, [predictionResult, dictionary]);

  const drawOnCanvas = (detectedLandmarks: NormalizedLandmark[][]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.videoWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const drawingUtils = new DrawingUtils(ctx);
    detectedLandmarks.forEach(hand => {
      drawingUtils.drawConnectors(hand, HAND_CONNECTIONS, { color: "#FFFFFF", lineWidth: 5 });
      drawingUtils.drawLandmarks(hand, { color: "#a6dbff", lineWidth: 2, radius: 5 });
    });
  };

  const sendToServer = async (landmarks: NormalizedLandmark[][]) => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    const modeSelect = document.getElementById("detection-mode") as HTMLSelectElement;
    const detectionMode = modeSelect.value.toLowerCase().includes('sibi') ? 'sibi' : 'bisindo';
    try {
      const response = await fetch("https://c39370ac0967.ngrok-free.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, landmarks, mode: detectionMode }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const result = await response.json();
      if (result.prediction && isDetectingRef.current) {
        if (result.prediction === lastPredictionRef.current) {
          predictionCountRef.current += 1;
        } else {
          lastPredictionRef.current = result.prediction;
          predictionCountRef.current = 1;
        }
        if (predictionCountRef.current === PREDICTION_THRESHOLD) {
          setPredictionResult(prev => prev + result.prediction);
        }
      }
    } catch (err) {
      console.error("Failed to send data to server:", err);
      setIsDetecting(false);
    }
  };

  const visualLoop = async () => {
    if (handLandmarkerRef.current && videoRef.current && videoRef.current.readyState === 4) {
      const results = handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      if (results.landmarks && results.landmarks.length > 0) {
        drawOnCanvas(results.landmarks);
        if (isDetectingRef.current) {
          await sendToServer(results.landmarks);
        }
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
    requestRef.current = requestAnimationFrame(visualLoop);
  };

  const handleDetectClick = () => {
    if (!isDetecting) {
      lastPredictionRef.current = "";
      predictionCountRef.current = 0;
    }
    setIsDetecting(prev => !prev);
  };
  
  const handleListenClick = () => {
    const recognition = speechRecognitionRef.current;
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(prev => !prev);
  };

  const handleClearClick = () => {
    setPredictionResult("");
    setSuggestionResult([]);
    lastPredictionRef.current = "";
    predictionCountRef.current = 0;
  };

  useEffect(() => {
    if (!isLoading) {
      async function getCameraStream() {
        if (!videoRef.current?.srcObject) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if(videoRef.current) videoRef.current.srcObject = stream;
 
          } catch (err) {
            setError("Kamera tidak dapat diakses. Mohon izinkan akses kamera di browser Anda.");
          }
        }
      }
      getCameraStream();
    }
    return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current) };
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <header>
        <Image src="/Asset Isyarat/SignBridge.png" alt="SignBridge Logo" width={250} height={50} priority />
      </header>
      <main>
        <div className="video-form-container">
          <div id="video-container">
            {error ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white', textAlign: 'center', padding: '1rem'}}>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
                <canvas ref={canvasRef} />
                <button className="settings-btn" onClick={() => setIsSettingsOpen(prev => !prev)}>
                  <FaCog size={20} />
                </button>
                {isSettingsOpen && (
                  <div className="settings-panel">
                    <div>
                      <label htmlFor="brightness">Kecerahan: {brightness}%</label>
                      <input type="range" id="brightness" min="50" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label htmlFor="contrast">Kontras: {contrast}%</label>
                      <input type="range" id="contrast" min="50" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label htmlFor="blur">Blur: {blur}px</label>
                      <input type="range" id="blur" min="0" max="10" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div id="field-container">
            <div>
              <label htmlFor="detection-mode">Mode Deteksi</label>
              <select id="detection-mode">
                <option>SIBI (1 Tangan)</option>
                <option>BISINDO (2 Tangan)</option>
              </select>
            </div>
            <div>
              <label htmlFor="detected-message">Pesan Terdeteksi</label>
              <textarea id="detected-message" rows={4} readOnly value={predictionResult} />
            </div>
            <div>
              <label htmlFor="suggestion">Saran Kata</label>
              <div className="suggested-area">
                {suggestionResult.map((word, index) => (
                  <span key={index} className="suggestion-word">
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <div className="button-group">
              <button onClick={handleDetectClick} className={isDetecting ? 'active-btn' : ''} disabled={isModelLoading}>
                {isModelLoading ? 'Memuat...' : (isDetecting ? <FaStopCircle /> : <FaVideo />)}
                {isModelLoading ? '' : (isDetecting ? 'Hentikan Deteksi' : 'Mulai Deteksi')}
              </button>
              <button onClick={handleListenClick} className={isListening ? 'active-btn' : ''} disabled={!isSpeechApiAvailable || isModelLoading}>
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  {isListening ? 'Mendengarkan...' : 'Rekam Suara'}
              </button>
              <button onClick={handleClearClick}><FaEraser /> Hapus</button>
            </div>
          </div>
        </div>
      </main>
      <h2 className="section-title">Kenali Bahasa Isyarat Indonesia</h2>
      <section className="info-section">
          <div className="info-card">
            <Image className="info-card-image" src="/Asset Isyarat/BISINDO.webp" alt="Abjad BISINDO" width={400} height={300} />
            <h3>BISINDO (Bahasa Isyarat Indonesia)</h3>
            <p>Lahir secara alami di kalangan komunitas Tuli, BISINDO memiliki struktur bahasa dan dialek yang unik di setiap daerah.</p>
          </div>
          <div className="info-card">
            <Image className="info-card-image" src="/Asset Isyarat/SIBI.webp" alt="Abjad SIBI" width={400} height={300} />
            <h3>SIBI (Sistem Isyarat Bahasa Indonesia)</h3>
            <p>Sistem isyarat yang dibuat pemerintah untuk mempermudah komunikasi di lingkungan sekolah dan media.</p>
          </div>
      </section>
    </>
  );
}