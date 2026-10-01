import React, { useState } from 'react';

interface MmaLogoProps {
  className?: string;
  size?: number;
}

export const MmaLogo: React.FC<MmaLogoProps> = ({ className = 'h-9 w-9', size = 36 }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    // Pure 2-color SVG fallback (yellow base #FFD200 & black contours #000000)
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} shrink-0 drop-shadow-md select-none`}
        width={size}
        height={size}
        aria-label="Logo MMA Brasão Caveira e Chaves"
        role="img"
      >
        {/* Shield Base (Amarelo) with Black Contour */}
        <path
          d="M 50 4 
             C 76 4, 92 6, 92 28 
             C 92 62, 70 86, 50 96 
             C 30 86, 8 62, 8 28 
             C 8 6, 24 4, 50 4 Z"
          fill="#FFD200"
          stroke="#000000"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Inner Shield Border */}
        <path
          d="M 50 9 
             C 72 9, 86 11, 86 29 
             C 86 59, 67 81, 50 90 
             C 33 81, 14 59, 14 29 
             C 14 11, 28 9, 50 9 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
        />

        {/* Banner Top: MMA Text */}
        <text
          x="50"
          y="23"
          textAnchor="middle"
          fill="#000000"
          fontFamily="Impact, 'Space Grotesk', sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="2"
        >
          MMA
        </text>

        {/* Crossed Combination Wrenches (Chaves de boca-luneta cruzadas em X) */}
        {/* Wrench 1 (Top-Left to Bottom-Right) */}
        <g transform="rotate(45 50 64)">
          {/* Shaft */}
          <rect x="47.5" y="44" width="5" height="38" rx="1.5" fill="#000000" />
          {/* Ring Spanner (Luneta) Top */}
          <circle cx="50" cy="42" r="7" fill="#FFD200" stroke="#000000" strokeWidth="3.5" />
          <circle cx="50" cy="42" r="3.2" fill="#000000" />
          {/* Open-Ended (Boca) Bottom */}
          <circle cx="50" cy="84" r="7" fill="#000000" />
          <path d="M 46 80 L 50 85 L 54 80 L 53 91 L 47 91 Z" fill="#FFD200" />
        </g>

        {/* Wrench 2 (Top-Right to Bottom-Left) */}
        <g transform="rotate(-45 50 64)">
          {/* Shaft */}
          <rect x="47.5" y="44" width="5" height="38" rx="1.5" fill="#000000" />
          {/* Ring Spanner (Luneta) Top */}
          <circle cx="50" cy="42" r="7" fill="#FFD200" stroke="#000000" strokeWidth="3.5" />
          <circle cx="50" cy="42" r="3.2" fill="#000000" />
          {/* Open-Ended (Boca) Bottom */}
          <circle cx="50" cy="84" r="7" fill="#000000" />
          <path d="M 46 80 L 50 85 L 54 80 L 53 91 L 47 91 Z" fill="#FFD200" />
        </g>

        {/* Metallic Skull (Caveira Metálica) in Center */}
        {/* Cranium */}
        <path
          d="M 50 26 
             C 63 26, 70 34, 70 45 
             C 70 51, 67 56, 63 58 
             L 63 64 
             C 63 66, 61 67, 59 67 
             L 41 67 
             C 39 67, 37 66, 37 64 
             L 37 58 
             C 33 56, 30 51, 30 45 
             C 30 34, 37 26, 50 26 Z"
          fill="#FFD200"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Brow line & Metallic Rivets */}
        <path d="M 33 42 Q 50 45 67 42" fill="none" stroke="#000000" strokeWidth="2.5" />
        <circle cx="50" cy="32" r="1.5" fill="#000000" />
        <circle cx="42" cy="34" r="1.3" fill="#000000" />
        <circle cx="58" cy="34" r="1.3" fill="#000000" />

        {/* Eye Sockets (Dark bold industrial shape) */}
        <polygon points="41,45 47,46 45,53 39,52" fill="#000000" />
        <polygon points="59,45 53,46 55,53 61,52" fill="#000000" />

        {/* Triangular Nose Cavity */}
        <polygon points="50,53 48,58 52,58" fill="#000000" />

        {/* Teeth / Maxilla */}
        <line x1="42" y1="61" x2="42" y2="67" stroke="#000000" strokeWidth="2" />
        <line x1="46" y1="60" x2="46" y2="67" stroke="#000000" strokeWidth="2" />
        <line x1="50" y1="60" x2="50" y2="67" stroke="#000000" strokeWidth="2" />
        <line x1="54" y1="60" x2="54" y2="67" stroke="#000000" strokeWidth="2" />
        <line x1="58" y1="61" x2="58" y2="67" stroke="#000000" strokeWidth="2" />
        <line x1="38" y1="63" x2="62" y2="63" stroke="#000000" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <div className={`relative ${className} shrink-0 flex items-center justify-center select-none`}>
      <img
        src="/src/assets/images/mma_shield_logo_1790848481380.jpg"
        alt="Logo MMA - Brasão Caveira Metálica e Chaves Cruzadas"
        className="w-full h-full object-contain rounded-md shadow-sm border border-[#2d3449]/50"
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
};
