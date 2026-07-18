'use client';

import { optimizeImage } from '@/lib/optimize-image';
import { filterArrayBySearchTerm, getText } from '@/lib/helper-functions';
import { InputOption } from '@/types';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

type AutocompleteProps = {
  options: InputOption[];
  placeholder?: string;
  onChange?: (value: InputOption) => void;
  onStopTyping?: (value: string) => void;
  label?: string;
  name?: string;
  required?: boolean;
  maxLength?: number;
  startingValue?: InputOption
};

const Autocomplete: React.FC<AutocompleteProps> = ({
    options,
    placeholder,
    onChange,
    onStopTyping,
    label,
    name = 'autocomplete',
    required,
    maxLength,
    startingValue
}) => {
  const [value, setValue] = useState<InputOption>('');
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const updateValue = (newValue: InputOption) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (startingValue && options.length) updateValue(options.find((op) => typeof op !== 'string' && op.id === startingValue) || startingValue)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOptions = useMemo(() => {
    return filterArrayBySearchTerm(options, getText(value));
  }, [options, value]);

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateValue(value);
    setShowOptions(value !== '');
    setActiveIndex(-1);
    if (onStopTyping) {
      clearTimeout(typingTimeout);
      setTypingTimeout(
        setTimeout(() => {
          onStopTyping(value);
        }, 500)
      )
    }
  };

  const handleOptionSelect = (option: InputOption) => {
    updateValue(option);
    setShowOptions(false);
    setActiveIndex(-1);
    if (onStopTyping) onStopTyping(getText(option));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions || filteredOptions.length === 0 || (event.key === 'Tab' && activeIndex === -1)) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleOptionSelect(filteredOptions[activeIndex]);
      } else if (filteredOptions.length === 1 && event.key === 'Enter') {
        handleOptionSelect(filteredOptions[0]);
      }
    } else if (event.key === 'Escape') {
      setShowOptions(false);
      setActiveIndex(-1);
    }
  };

  const getImage = (option: InputOption) => {
    if (typeof option === 'string' || !option.image) return null;
    return (
      <div className='mr-2' style={{ position: 'absolute', left: '10px', top: '49%', transform: 'translateY(-50%)' }}>
        <Image src={optimizeImage(option.image, 72, 72, 90, true, true)} alt={option.text} width={25} height={25} />
      </div>
    )
  }
  let inputLabel = label;
  if (label && required) inputLabel += ' *';

  return (
    <div className="flex flex-col relative w-full">
      {label && <label htmlFor={name}>{inputLabel}</label>}
      <div className='flex flex-col relative w-full'>
        {getImage(value)}
        <input
          style={typeof value === 'object' &&  value.image ? {paddingLeft: '42px'} : undefined}
          name={name}
          id={name}
          required={required}
          type="text"
          value={getText(value)}
          data-id={typeof value === 'string' ? value : value.id}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(value !== '')}
          onBlur={() => setTimeout(() => setShowOptions(false), 100)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          maxLength={maxLength}
        />
      </div>
    {typeof value === 'object' && value.id ? (
      <input className='hidden' name={`${name}-id`} value={value.id} onChange={() => null} />
    ) : null}

      {showOptions && filteredOptions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            background: 'var(--background)',
            border: '1px solid #ccc',
            borderTop: 'none',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={`${getText(option)}-${index}`}
              onMouseDown={() => handleOptionSelect(option)}
              style={{
                padding: '8px 12px',
                color: index === activeIndex ? '#ffffff' : undefined,
                background: index === activeIndex ? '#0028aa' : 'var(--background)',
                cursor: 'pointer',
                paddingLeft: typeof option === 'object' &&  option.image ? '42px' : '12px',
                position: 'relative'
              }}
              className="flex flex-row"
            >
              {getImage(option)}
              {getText(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
