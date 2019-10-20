import { useState } from 'react';

interface Utils {
  addInputs: (count?: number) => void;
  setInputCount: (count: number) => void;
  setInputValues: (values: string[]) => void;
  removeInputs: (from: number, to: number) => void;
}

export function useInputArray(
  ...defaultValues: string[]
): [string[], (index: number, newValue: string) => void, Utils] {
  const [values, setValues] = useState(defaultValues);

  const onChangeInputAtIndex = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  const addInputs = (count = 1) => {
    const newValues = [...values, ...new Array(count).fill('')];
    setValues(newValues);
  };

  const setInputCount = (count: number) => {
    const newValues = values.slice(0, count);
    while (newValues.length < count) {
      newValues.push('');
    }
    setValues(newValues);
  };

  const removeInputs = (from: number, to: number) => {
    const newValues = [...values.slice(0, from), ...values.slice(to)];
    setValues(newValues);
  };

  return [
    values,
    onChangeInputAtIndex,
    {
      addInputs,
      setInputCount,
      setInputValues: setValues,
      removeInputs,
    },
  ];
}
