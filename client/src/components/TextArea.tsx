import * as React from 'react';

import { Themes, THEMES } from '../constants';

import { InputEvent } from '../types';

type TextAreaTheme = Themes.primary | Themes.info | Themes.success | Themes.warning | Themes.danger;

interface Props {
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  loading?: boolean;
  theme?: TextAreaTheme | '';
}

const TextArea = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  defaultValue,
  disabled,
  loading,
  theme = THEMES.none,
}: Props) => {
  const changeHandler = React.useCallback(
    (event: InputEvent<string>) => {
      if (onChange) onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <p className={`control ${loading ? 'is-loading' : ''}`}>
        <textarea
          className={`textarea ${theme}`}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={changeHandler}
        />
      </p>
    </div>
  );
};

export { TextArea };
