import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import Switch from '@/global/components/Switch';

export type SettingsOption =
  | { type: 'label'; label: string; onClick?: () => void }
  | { type: 'switch'; label: string; value: boolean; onChange: (value: boolean) => void };

interface SettingsMenuProps {
  options: SettingsOption[];
}

export default function SettingsMenu({ options }: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative' ref={menuRef}>
      <button
        className={twMerge(
          'bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex h-[40px] w-[40px] items-center justify-center rounded-[8px] transition-all duration-300 ease-in-out hover:rotate-45',
          isOpen && 'bg-light-gray text-light-text rotate-45',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className='h-[24px] w-[24px] text-inherit' />
      </button>

      {isRendered && (
        <div
          className={twMerge(
            'bg-bg border-light-gray absolute top-[calc(100%+8px)] right-0 z-50 flex w-[200px] flex-col gap-[4px] rounded-[12px] border-[1px] border-solid p-[6px] shadow-xl backdrop-blur-sm',
            'origin-top-right transition-all duration-200 ease-out',
            isOpen ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
          )}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className='hover:bg-dark-gray text-dark-text group flex cursor-pointer items-center justify-between rounded-[8px] px-[12px] py-[10px] transition-all duration-200 ease-in-out hover:pl-[14px]'
              onClick={() => {
                if (option.type === 'label') {
                  option.onClick?.();
                  setIsOpen(false);
                } else if (option.type === 'switch') {
                  option.onChange(!option.value);
                }
              }}
            >
              <span className='text-[14px] font-medium transition-colors group-hover:text-white'>{option.label}</span>

              {option.type === 'switch' && <Switch checked={option.value} onChange={option.onChange} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
