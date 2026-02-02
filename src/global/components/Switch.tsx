import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function Switch({ checked, onChange, className }: SwitchProps) {
  return (
    <div
      role='switch'
      aria-checked={checked}
      className={twMerge(
        clsx(
          'relative h-[22px] w-[40px] cursor-pointer rounded-full transition-colors duration-300 ease-in-out',
          checked ? 'bg-indigo-500' : 'bg-gray-600',
        ),
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      <div
        className={clsx(
          'absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          checked ? 'translate-x-[21px]' : 'translate-x-[3px]',
        )}
      />
    </div>
  );
}
