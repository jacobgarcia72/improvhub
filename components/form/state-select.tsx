'use client';

import React from 'react';
import { states } from '@/lib/location';

export default function StateSelect({
  name,
  label = 'State',
  onChange,
  value
}: {
  name?: string,
  label?: string,
  onChange?: (value: string) => void,
  value?: string
}) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col w-[178px]">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        className="border border-gray-300 rounded px-3 py-2"
        onChange={handleChange}
        value={value}
      >
        <option value=""></option>
        {states.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
}