import { useState } from 'react';

export function useInput<T>(
  defaultValue: T,
): [T, (newValue: T) => void, (newValue: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  const onChange = (newValue: T) => setValue(newValue);

  return [value, onChange, setValue];
}
