import type { StoneColorProfile } from '@dodagames/go';

export const NEON_PROFILES = {
  BLUE: {
    name: 'Neon Blue',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #60a5fa, #2563eb)',
      shadow: '0 0 15px rgba(37, 99, 235, 0.6)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(37, 99, 235, 0.5)',
    },
    currentMoveMarkColor: 'rgba(255, 255, 255, 1.0)',
    sequenceNumberColor: 'rgba(255, 255, 255, 0.5)',
  },
  RED: {
    name: 'Neon Red',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #f87171, #dc2626)',
      shadow: '0 0 15px rgba(220, 38, 38, 0.6)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(220, 38, 38, 0.5)',
    },
    currentMoveMarkColor: 'rgba(220, 38, 38, 0.5)',
    sequenceNumberColor: 'rgba(220, 38, 38, 0.5)',
  },
  GREEN: {
    name: 'Neon Green',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #86efac, #16a34a)',
      shadow: '0 0 15px rgba(22, 163, 74, 0.6)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(22, 163, 74, 0.5)',
    },
    currentMoveMarkColor: 'rgba(22, 163, 74, 0.5)',
    sequenceNumberColor: 'rgba(22, 163, 74, 0.5)',
  },
  PURPLE: {
    name: 'Neon Purple',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #d8b4fe, #9333ea)',
      shadow: '0 0 15px rgba(147, 51, 234, 0.6)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(147, 51, 234, 0.5)',
    },
    currentMoveMarkColor: 'rgba(147, 51, 234, 0.5)',
    sequenceNumberColor: 'rgba(147, 51, 234, 0.5)',
  },
  ORANGE: {
    name: 'Neon Orange',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #fdba74, #ea580c)',
      shadow: '0 0 15px rgba(234, 88, 12, 0.6)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(234, 88, 12, 0.5)',
    },
    currentMoveMarkColor: 'rgba(234, 88, 12, 0.5)',
    sequenceNumberColor: 'rgba(234, 88, 12, 0.5)',
  },
  WHITE: {
    name: 'Bright White',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #ffffff, #94a3b8)',
      shadow: '0 0 15px rgba(255, 255, 255, 0.4)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(255, 255, 255, 0.3)',
    },
    currentMoveMarkColor: 'rgba(37, 99, 235, 1.0)',
    sequenceNumberColor: 'rgba(37, 99, 235, 0.5)',
  },
  BLACK: {
    name: 'Deep Black',
    stoneStyle: {
      type: 'gradient',
      css: 'radial-gradient(circle at 30% 30%, #555, #000)',
      shadow: '0 0 15px rgba(0, 0, 0, 0.8)',
    },
    stonePreviewStyle: {
      type: 'color',
      color: 'rgba(0, 0, 0, 0.5)',
    },
    currentMoveMarkColor: 'rgba(0, 0, 0, 0.5)',
    sequenceNumberColor: 'rgba(0, 0, 0, 0.5)',
  },
} as const satisfies Record<string, StoneColorProfile>;
