'use client';

import { filterArrayBySearchTerm, getText } from '@/lib/helper-functions';
import { InputOption } from '@/types';
import React, { useMemo, useState } from 'react';

type AutocompleteProps = {
  options: InputOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  onStopTyping?: (value: string) => void;
  label?: string;
  name?: string;
  required?: boolean;
};

const Autocomplete: React.FC<AutocompleteProps> = ({
    options,
    placeholder,
    onChange,
    onStopTyping,
    label,
    name = 'autocomplete',
    required
}) => {
  const [value, setValue] = useState<InputOption>('');
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    return filterArrayBySearchTerm(options, getText(value));
  }, [options, value]);

  const updateValue = (newValue: InputOption) => {
    setValue(newValue);
    onChange?.(getText(newValue));
  };

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

    let inputLabel = label;
    if (label && required) inputLabel += ' *';

  return (
    <div className="flex flex-col relative w-full">
      {label && <label htmlFor={name}>{inputLabel}</label>}
      <input
        name={name}
        id={name}
        required={required}
        type="text"
        value={typeof value === 'string' ? value : value.value}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(value !== '')}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

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
            background: '#fff',
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
                background: index === activeIndex ? '#f0f0f0' : '#fff',
                cursor: 'pointer',
              }}
            >
              {getText(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
