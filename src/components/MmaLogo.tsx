import React from 'react';
import { MMA_LOGO_IMAGE } from '../assets/mmaLogoBase64';

interface MmaLogoProps {
  className?: string;
  size?: number;
}

/**
 * MmaLogo Component
 * Utiliza a imagem oficial em alta definição (1024x1024) do brasão MMA
 * incorporada de forma totalmente autónoma via data URI para garantir 100% de
 * fidelidade visual, qualidade máxima e funcionamento perfeito tanto localmente
 * como publicado no GitHub / GitHub Pages sem erros de carregamento (404) ou perda de qualidade.
 */
export const MmaLogo: React.FC<MmaLogoProps> = ({ className = 'h-9 w-9', size }) => {
  return (
    <div
      style={size ? { width: size, height: size } : undefined}
      className={`relative ${className} shrink-0 flex items-center justify-center select-none overflow-hidden rounded-md shadow-sm border border-[#2d3449]/50 bg-[#060e20]`}
    >
      <img
        src={MMA_LOGO_IMAGE}
        alt="Logo MMA - Brasão Caveira Metálica e Chaves de Boca-Luneta Cruzadas"
        className="w-full h-full object-contain"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
