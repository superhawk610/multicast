import { useState } from 'react';

export function useBooleanState(
  defaultValue = false,
): [boolean, () => void, (v: boolean) => void] {
  const [value, setValue] = useState(defaultValue);

  const toggleValue = () => setValue(!value);

  return [value, toggleValue, setValue];
}
