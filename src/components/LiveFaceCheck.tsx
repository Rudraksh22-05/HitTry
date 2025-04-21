import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Hands } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

interface LiveFaceCheckProps {
  onSuccess: (gender: string) => void;
}

const MODEL_URL = '/models'; // Place face-api.js models in public/models

const LiveFaceCheck: React.FC<LiveFaceCheckProps> = ({ onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [proceedTimeout, setProceedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Finger challenge state
  const [fingerChallenge, setFingerChallenge] = useState<number | null>(null);
  const [fingerChallengePassed, setFingerChallengePassed] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  // Utility to stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      setError('');
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
        setLoading(false);
      } catch (e) {
        setError('Failed to load face-api models.');
        setLoading(false);
      }
    };
    loadModels();
  }, []);

  // Generate a random finger challenge (1-4 fingers)
  useEffect(() => {
    if (gender === 'female' && !fingerChallengePassed && fingerChallenge === null) {
      setFingerChallenge(1 + Math.floor(Math.random() * 4)); // Only 1-4
    }
    // Reset if gender changes or challenge resets
    if ((gender !== 'female' || fingerChallengePassed) && fingerChallenge !== null) {
      setFingerChallenge(null);
      setFingerChallengePassed(false);
    }
  }, [gender, fingerChallengePassed, fingerChallenge]);

  // MediaPipe Hands Detection
  useEffect(() => {
    if (!videoRef.current || fingerChallenge === null || fingerChallengePassed || gender !== 'female') return;
    let running = true;
    let hands: Hands | null = null;
    const video = videoRef.current;

    const onResults = (results: any) => {
      if (!running) return;
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        if (fingerChallenge === 1) {
          if (isOneFinger(landmarks)) {
            setFingerChallengePassed(true);
          }
        } else {
          const fingerCount = countFingers(landmarks);
          if (fingerCount === fingerChallenge) {
            setFingerChallengePassed(true);
          }
        }
      }
    };

    // Improved Finger counting helper: returns number of extended fingers
    function countFingers(landmarks: any[]): number {
      // For each finger, check if tip is above pip (y is smaller for up)
      // Thumb logic: check if thumb tip is away from palm in x direction
      const isThumbUp = Math.abs(landmarks[4].x - landmarks[2].x) > 0.18 &&
        ((landmarks[4].x < landmarks[3].x && landmarks[4].x < landmarks[2].x) ||
         (landmarks[4].x > landmarks[3].x && landmarks[4].x > landmarks[2].x));
      const isIndexUp = landmarks[8].y < landmarks[6].y && landmarks[7].y < landmarks[5].y;
      const isMiddleUp = landmarks[12].y < landmarks[10].y && landmarks[11].y < landmarks[9].y;
      const isRingUp = landmarks[16].y < landmarks[14].y && landmarks[15].y < landmarks[13].y;
      const isPinkyUp = landmarks[20].y < landmarks[18].y && landmarks[19].y < landmarks[17].y;
      let count = 0;
      if (isThumbUp) count++;
      if (isIndexUp) count++;
      if (isMiddleUp) count++;
      if (isRingUp) count++;
      if (isPinkyUp) count++;
      return count;
    }

    // For 1 finger, require only index up, rest down
    function isOneFinger(landmarks: any[]): boolean {
      const isIndexUp = landmarks[8].y < landmarks[6].y && landmarks[7].y < landmarks[5].y;
      const isThumbUp = Math.abs(landmarks[4].x - landmarks[2].x) > 0.18 &&
        ((landmarks[4].x < landmarks[3].x && landmarks[4].x < landmarks[2].x) ||
         (landmarks[4].x > landmarks[3].x && landmarks[4].x > landmarks[2].x));
      const isMiddleUp = landmarks[12].y < landmarks[10].y && landmarks[11].y < landmarks[9].y;
      const isRingUp = landmarks[16].y < landmarks[14].y && landmarks[15].y < landmarks[13].y;
      const isPinkyUp = landmarks[20].y < landmarks[18].y && landmarks[19].y < landmarks[17].y;
      // Only index up
      return isIndexUp && !isThumbUp && !isMiddleUp && !isRingUp && !isPinkyUp;
    }

    hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    hands.onResults(onResults);

    let animationId: number;
    const processFrame = async () => {
      if (!videoRef.current || !running) return;
      await hands!.send({ image: videoRef.current });
      animationId = requestAnimationFrame(processFrame);
    };
    processFrame();
    return () => {
      running = false;
      hands && hands.close();
      cancelAnimationFrame(animationId);
    };
  }, [videoRef, fingerChallenge, fingerChallengePassed, gender]);

  // When challenge is passed, increment successCount and reset challenge
  useEffect(() => {
    if (fingerChallengePassed && gender === 'female') {
      setSuccessCount((prev) => prev + 1);
      setFingerChallengePassed(false);
      setFingerChallenge(null);
    }
  }, [fingerChallengePassed, gender]);

  // Complete verification after 3 successes
  useEffect(() => {
    if (successCount >= 3 && gender === 'female' && !livenessPassed) {
      setLivenessPassed(true);
      stopCamera();
      onSuccess(gender);
    }
  }, [successCount, gender, livenessPassed, onSuccess]);

  // --- Screen Reflection & Moiré Detection ---
  function detectScreenArtifacts(video: HTMLVideoElement): boolean {
    // Create a canvas to capture a frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    // 1. Glare Detection: Check for large bright regions
    let brightPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r > 220 && g > 220 && b > 220) brightPixels++;
    }
    const brightRatio = brightPixels / (w * h);
    if (brightRatio > 0.08) return true; // >8% of image is very bright: likely glare

    // 2. Moiré/High-Frequency Pattern Detection (simple Laplacian edge count)
    // Convert to grayscale
    const gray = new Uint8ClampedArray(w * h);
    for (let i = 0; i < w * h; i++) {
      gray[i] = 0.299 * data[i*4] + 0.587 * data[i*4+1] + 0.114 * data[i*4+2];
    }
    // Simple Laplacian kernel
    function laplacian(x: number, y: number): number {
      if (x <= 0 || y <= 0 || x >= w-1 || y >= h-1) return 0;
      const idx = (y * w + x);
      return (
        4 * gray[idx]
        - gray[idx - 1]
        - gray[idx + 1]
        - gray[idx - w]
        - gray[idx + w]
      );
    }
    let edgeSum = 0;
    for (let y = 1; y < h-1; y += 2) {
      for (let x = 1; x < w-1; x += 2) {
        edgeSum += Math.abs(laplacian(x, y));
      }
    }
    const edgeAvg = edgeSum / ((w-2)*(h-2)/4);
    if (edgeAvg > 18) return true; // High average edge: likely moiré/screen

    return false;
  }

  // Only run gender detection if challenge not started
  useEffect(() => {
    if (loading || error || !videoRef.current) return;
    let interval: NodeJS.Timeout;
    const analyze = async () => {
      if (!videoRef.current) return;
      const result = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withAgeAndGender();
      if (result) {
        setGender(result.gender);
      }
    };
    interval = setInterval(analyze, 300);
    return () => clearInterval(interval);
  }, [loading, error, videoRef, gender]);

  // Start webcam
  useEffect(() => {
    if (!loading && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current!.srcObject = stream;
        })
        .catch(() => setError('Unable to access camera.'));
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [loading]);

  // Stop camera when liveness is passed and user is redirected
  useEffect(() => {
    if (livenessPassed) {
      stopCamera();
    }
  }, [livenessPassed]);

  // Also clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (proceedTimeout) clearTimeout(proceedTimeout);
    };
  }, [proceedTimeout]);

  return (
    <div style={{ textAlign: 'center' }}>
      {loading && <div>Loading face detection models...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <video ref={videoRef} autoPlay muted width={320} height={240} style={{ borderRadius: 8, display: loading ? 'none' : 'block', margin: '0 auto' }} />
      {!loading && gender && <div style={{ marginTop: 8 }}>Detected Gender: <b>{gender}</b></div>}
      {fingerChallenge !== null && !fingerChallengePassed && (
        <div style={{ fontWeight: 'bold', margin: '16px', color: '#b45309' }}>
          Please show <span style={{ fontSize: '1.5em' }}>{fingerChallenge}</span> finger{fingerChallenge > 1 ? 's' : ''} to the camera
        </div>
      )}
      {successCount > 0 && successCount < 3 && (
        <div style={{ color: '#b45309', fontWeight: 'bold', margin: '16px' }}>
          Successes: {successCount} / 3
        </div>
      )}
      {successCount >= 3 && (
        <div style={{ color: 'green', fontWeight: 'bold', margin: '16px' }}>
          Verification complete!
        </div>
      )}
      {fingerChallengePassed && (
        <div style={{ color: 'green', fontWeight: 'bold', margin: '16px' }}>
          Finger challenge passed! Liveness check passed. Proceeding to signup...
        </div>
      )}
      {!loading && gender !== 'female' && (
        <div style={{ color: 'orange', marginTop: 8 }}>
          Only females can proceed to signup.
        </div>
      )}
      {!loading && livenessPassed && gender === 'female' && (
        <div style={{ color: 'green', marginTop: 8 }}>Liveness check passed! Proceeding to signup...</div>
      )}
    </div>
  );
};

export default LiveFaceCheck;
