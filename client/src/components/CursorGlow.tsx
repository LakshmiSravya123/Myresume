import { useState, useEffect } from 'react';

export default function CursorGlow() {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: -300,
    y: -300,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{
        left: position.x,
        top: position.y,
        width: 600,
        height: 600,
        zIndex: 1,
        background:
          'radial-gradient(circle, rgba(0,212,255,0.04) 0%, rgba(168,85,247,0.02) 40%, transparent 70%)',
      }}
    />
  );
}
