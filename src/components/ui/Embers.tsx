"use client";

import { useEffect, useState } from "react";

interface EmberProps {
  count?: number;
}

export default function Embers({ count = 20 }: EmberProps) {
  const [embers, setEmbers] = useState<Array<{ id: number; left: string; size: string; duration: string; delay: string; twinkleDuration: string }>>([]);

  useEffect(() => {
    // Generate random values only on client to avoid hydration mismatch
    const newEmbers = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 20 + 15}s`,
      delay: `-${Math.random() * 20}s`,
      twinkleDuration: `${Math.random() * 1.5 + 0.5}s`,
    }));
    setEmbers(newEmbers);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="ember"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            "--duration": ember.duration,
            "--delay": ember.delay,
            "--twinkle": ember.twinkleDuration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
