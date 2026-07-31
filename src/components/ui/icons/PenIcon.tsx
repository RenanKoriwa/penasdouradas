import React from 'react';

export default function PenIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <div
      className={`${className} bg-current inline-block`}
      style={{
        maskImage: "url('/images/pen-icon.png')",
        WebkitMaskImage: "url('/images/pen-icon.png')",
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
