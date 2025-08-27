import { useState } from 'react';

import FullScreen from '@/assets/icons/full-screen.svg?react';
import cls from '@/global/utils/cls';

export default function ToggleFullScreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // 전체화면 아님 → 전체화면으로 전환
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      // 전체화면 상태 → 해제
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className={cls(
        'absolute right-[20px] bottom-[20px] flex items-center justify-center w-[40px] h-[40px] rounded-[8px] transition-colors duration-200',
        isFullscreen
          ? 'bg-light-gray text-light-text'
          : 'bg-dark-gray text-dark-text hover:bg-light-gray hover:text-light-text',
      )}
    >
      <FullScreen className='text-inherit' />
    </button>
  );
}
