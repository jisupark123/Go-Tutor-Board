import type { BoardStyleConfig } from '@dodagames/go';

export const spaceBoardStyleConfig = {
  name: 'Space',
  bgStyle: { type: 'color', bgColor: '#000000', bgGradient: 'bg-neutral-900' },
  borderColor: '#333',
  // 선굵기
  gridColor: 'rgba(255, 255, 255, 0.6)',
  starPointColor: '#555555',
} as const satisfies BoardStyleConfig;
