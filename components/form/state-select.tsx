'use client';

import React, { forwardRef } from 'react';
import { states } from '@/lib/location';

type StateSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  name?: string;
  label?: string;
  onChange?: (value: string) => void;
};

const StateSelect = forwardRef<HTMLSelectElement, StateSelectProps>(function StateSelect(
  { name = 'state', label, children, onChange, ...props },
  ref,
) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        ref={ref}
        id={name}
        name={name}
        className="border border-gray-300 rounded px-3 py-2"
        onChange={handleChange}
        {...props}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name}
          </option>
        ))}
        {children}
      </select>
    </div>
  );
});

export default StateSelect;
