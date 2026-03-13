import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, Share2 } from 'lucide-react';

interface ARViewerProps {
  vehicleName?: string;
  onClose?: () => void;
}

export const ARViewer: React.FC<ARViewerProps> = ({ 
  vehicleName = 'Honda CR-V',
  onClose 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARSupported, setIsARSupported] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [carScale, setCarScale] = useState(1);
  const [carRotation, setCarRotation] = useState(0);

  useEffect(() => {
    // Check if WebGL AR is supported
    const checkARSupport = async () => {
      if ('XRSession' in window || 'webkitXRSession' in window) {
        setIsARSupported(true);
      } else {
        // For demo, allow AR on devices with camera access
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setIsARSupported(true);
        } catch {
          setIsARSupported(false);
        }
      }
    };

    checkARSupport();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setShowInstructions(false);

        // Start drawing the augmented car
        drawARScene();
      }
    } catch (error) {
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const drawARScene = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw semi-transparent AR car
      ctx.save();
      ctx.globalAlpha = 0.7;

      // Move to center and apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((carRotation * Math.PI) / 180);
      ctx.scale(carScale, carScale);

      // Draw simplified car shape
      drawCar(ctx);

      ctx.restore();

      // Draw UI overlays
      drawARUI(ctx, canvas);

      if (cameraActive) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  const drawCar = (ctx: CanvasRenderingContext2D) => {
    // Car body
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-60, -30, 120, 50);

    // Car cabin
    ctx.fillRect(-45, -50, 90, 20);

    // Wheels
    ctx.fillStyle = '#333333';
    ctx.fillRect(-55, -15, 20, 20);
    ctx.fillRect(35, -15, 20, 20);

    // Windows
    ctx.fillStyle = '#87ceeb';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-40, -48, 35, 18);
    ctx.fillRect(5, -48, 35, 18);
    ctx.globalAlpha = 1;

    // Headlights
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(-35, -25, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(35, -25, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawARUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Grid overlay
    ctx.strokeStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Center crosshair
    ctx.strokeStyle = 'rgba(74, 144, 226, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - 20);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 + 20);
    ctx.stroke();

    // Info text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 5;
    ctx.fillText(`${vehicleName} - AR Preview`, 10, 30);
  };

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = `${vehicleName}-ar-preview.png`;
      link.click();
    }
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarScale(parseFloat(e.target.value));
    drawARScene();
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarRotation(parseFloat(e.target.value));
    drawARScene();
  };

  if (!isARSupported) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 text-center shadow-xl"
      >
        <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">AR Not Supported</h3>
        <p className="text-gray-600">
          Your device doesn't support AR capabilities. Please use a modern smartphone or tablet with camera access.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Camera Feed */}
      <div className="relative w-full aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
        />
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className={`absolute inset-0 w-full h-full ${!cameraActive ? 'hidden' : ''}`}
        />

        {/* Instructions Overlay */}
        {showInstructions && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center text-white"
            >
              <Camera className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">AR Car Viewer</h3>
              <p className="text-gray-300 mb-8 max-w-xs">
                See how {vehicleName} looks in your space using Augmented Reality
              </p>
              <button
                onClick={startCamera}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start AR View
              </button>
            </motion.div>
          </div>
        )}

        {/* Close Button */}
        {cameraActive && (
          <button
            onClick={() => {
              stopCamera();
              onClose?.();
            }}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controls */}
      {cameraActive && (
        <div className="bg-gray-900 p-6 space-y-4">
          {/* Scale Control */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Scale: {carScale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={carScale}
              onChange={handleScaleChange}
              className="w-full"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Rotation: {carRotation.toFixed(0)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={carRotation}
              onChange={handleRotationChange}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={takeScreenshot}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Save Screenshot
            </button>
            <button
              onClick={() => {
                takeScreenshot();
                // Would integrate share API here
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>
      )}

      {/* Start Button When Inactive */}
      {!cameraActive && !showInstructions && (
        <div className="bg-gray-900 p-6">
          <button
            onClick={startCamera}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Start AR View
          </button>
        </div>
      )}
    </motion.div>
  );
};
