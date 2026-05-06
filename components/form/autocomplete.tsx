'use client';

import { filterArrayBySearchTerm } from '@/lib/helper-functions';
import React, { useMemo, useState } from 'react';

type AutocompleteProps = {
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
  label?: string;
  name?: string;
  required?: boolean;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ options, placeholder, onChange, label, name = 'autocomplete', required }) => {
  const [value, setValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    return filterArrayBySearchTerm(options, value);
  }, [options, value]);

  const updateValue = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(event.target.value);
    setShowOptions(event.target.value !== '');
    setActiveIndex(-1);
  };

  const handleOptionSelect = (option: string) => {
    updateValue(option);
    setShowOptions(false);
    setActiveIndex(-1);
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
    <div style={{ position: 'relative', width: '100%' }}>
      {label && <label htmlFor={name}>{inputLabel}</label>}
      <input
        name={name}
        id={name}
        required={required}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(value !== '')}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
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
              key={`${option}-${index}`}
              onMouseDown={() => handleOptionSelect(option)}
              style={{
                padding: '8px 12px',
                background: index === activeIndex ? '#f0f0f0' : '#fff',
                cursor: 'pointer',
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
