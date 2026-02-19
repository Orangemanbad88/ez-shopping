import React, { useState, useRef, useCallback } from 'react';
import { X, Check } from 'lucide-react';

export const TapToMeasureOverlay = ({ pixelsPerInch, targetLabel, onMeasured, onCancel }) => {
  const [points, setPoints] = useState([]);
  const containerRef = useRef(null);

  const handleTap = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;

    setPoints(prev => {
      if (prev.length >= 2) return [{ x, y }];
      return [...prev, { x, y }];
    });
  }, []);

  const distance = points.length === 2
    ? Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))
    : null;

  const inches = distance !== null ? Math.round(distance / pixelsPerInch) : null;

  const handleConfirm = () => {
    if (inches !== null) onMeasured({ inches });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 cursor-crosshair"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={handleTap}
    >
      {/* Instructions */}
      <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
          <p className="text-white text-sm font-medium">
            {points.length === 0 && `Tap first point of ${targetLabel}`}
            {points.length === 1 && `Tap second point of ${targetLabel}`}
            {points.length === 2 && `${targetLabel}: ${inches}"`}
          </p>
        </div>
      </div>

      {/* Points */}
      {points.map((pt, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: pt.x, top: pt.y }}
        >
          <div className="w-5 h-5 rounded-full bg-teal-400 border-2 border-white shadow-lg" />
        </div>
      ))}

      {/* Line between points */}
      {points.length === 2 && (() => {
        const dx = points[1].x - points[0].x;
        const dy = points[1].y - points[0].y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <div
            className="absolute pointer-events-none"
            style={{
              left: points[0].x,
              top: points[0].y,
              width: length,
              height: 2,
              background: '#5eead4',
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              boxShadow: '0 0 6px rgba(94,234,212,0.5)',
            }}
          />
        );
      })()}

      {/* Buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        {points.length === 2 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
            className="px-5 py-3 rounded-xl bg-teal-500 text-white font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Use {inches}"
          </button>
        )}
      </div>
    </div>
  );
};
