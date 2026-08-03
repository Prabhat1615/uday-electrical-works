import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export const QRCodeGenerator = ({ value = '', size = 100 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error('QR Code render error:', error);
      });
    }
  }, [value, size]);

  return (
    <div className="inline-block p-1 bg-white border border-gray-300 rounded shadow-sm">
      <canvas ref={canvasRef} />
    </div>
  );
};
