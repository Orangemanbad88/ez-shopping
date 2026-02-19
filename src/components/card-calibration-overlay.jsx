import React, { useState, useRef, useCallback } from 'react';
import { X, Check } from 'lucide-react';

const CARD_ASPECT = 3.375 / 2.125; // standard credit card width/height
const CARD_WIDTH_INCHES = 3.375;

export const CardCalibrationOverlay = ({ onCalibrated, onCancel, videoRef }) => {
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(200); // initial card outline width in px
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(200);

  const cardHeight = cardWidth / CARD_ASPECT;

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    startWidth.current = cardWidth;
    const onMove = (ev) => {
      if (!dragging.current) return;
      const clientX = ev.clientX || ev.touches?.[0]?.clientX || 0;
      const delta = clientX - startX.current;
      const newWidth = Math.max(80, Math.min(400, startWidth.current + delta * 2));
      setCardWidth(newWidth);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }, [cardWidth]);

  const handleConfirm = () => {
    const pixelsPerInch = cardWidth / CARD_WIDTH_INCHES;
    onCalibrated({ pixelsPerInch });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
    >
      {/* Instructions */}
      <div className="text-center mb-6 px-4">
        <p className="text-white font-semibold text-lg mb-1">Align Credit Card</p>
        <p className="text-gray-300 text-sm">Drag the corners to match your physical card</p>
      </div>

      {/* Card outline */}
      <div
        className="relative border-2 border-teal-400 rounded-lg"
        style={{
          width: cardWidth,
          height: cardHeight,
          boxShadow: '0 0 0 2000px rgba(0,0,0,0.4), 0 0 20px rgba(94,234,212,0.3)',
        }}
      >
        {/* Corner drag handles */}
        {[
          { top: -8, left: -8 },
          { top: -8, right: -8 },
          { bottom: -8, left: -8 },
          { bottom: -8, right: -8 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-5 h-5 bg-teal-400 rounded-full border-2 border-white cursor-grab active:cursor-grabbing"
            style={{ ...pos, touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          />
        ))}

        {/* Card label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-teal-300 text-xs font-medium opacity-70">3.375" x 2.125"</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Confirm
        </button>
      </div>
    </div>
  );
};
