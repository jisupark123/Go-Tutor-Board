export type ToggleButtonGroupOption<T extends string> = {
  label: string;
  value: T;
};

interface ToggleButtonGroupProps<T extends string> {
  options: ToggleButtonGroupOption<T>[];
  value: T;
  onChange?: (value: T) => void;
}

export default function ToggleButtonGroup<T extends string>({ options, value, onChange }: ToggleButtonGroupProps<T>) {
  const handleClick = (value: T) => {
    onChange?.(value);
  };

  return (
    <div className='flex gap-[2px] p-[2px] bg-dark-gray rounded-[8px]'>
      {options.map(({ label, value: optionValue }) => (
        <button
          key={optionValue}
          onClick={() => handleClick(optionValue)}
          className={`px-[12px] py-[4px] rounded-[8px] text-[20px] font-bold transition-colors duration-200 ${
            value === optionValue ? 'bg-light-gray text-light-text' : ' text-dark-text hover:bg-light-gray'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
