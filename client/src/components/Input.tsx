import * as React from 'react';

import { InputError } from './InputError';

import Icon from 'react-icons-kit';

import { Themes, THEMES, COLORS } from '../constants';

import { InputEvent } from '../types';

type InputTheme = Themes.primary | Themes.info | Themes.success | Themes.warning | Themes.danger;

interface Props {
  label?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string | null;
  name?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  theme?: InputTheme | '';
}

const Input = ({
  label,
  required,
  type = 'text',
  placeholder,
  error,
  name,
  value,
  onChange,
  defaultValue,
  disabled,
  loading,
  leftIcon,
  rightIcon,
  theme = THEMES.none,
}: Props) => {
  const loadingClass = loading ? 'is-loading' : '';
  const leftIconClass = leftIcon ? 'has-icons-left' : '';
  const rightIconClass = rightIcon ? 'has-icons-right' : '';

  const changeHandler = React.useCallback(
    (event: InputEvent<string>) => {
      if (onChange) onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className="field">
      {label && (
        <label className={`label ${error ? 'has-text-danger' : ''}`}>
          {label}
          {required && <span style={{ color: COLORS.greyLighter }}> *</span>}
        </label>
      )}
      <p className={`control ${loadingClass} ${leftIconClass} ${rightIconClass}`}>
        <input
          required={required}
          type={type}
          className={`input ${error ? THEMES.danger : theme}`}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={changeHandler}
        />
        {leftIcon && (
          <span className="icon is-left">
            <Icon icon={leftIcon} />
          </span>
        )}
        {rightIcon && (
          <span className="icon is-right">
            <Icon icon={rightIcon} />
          </span>
        )}
      </p>
      {error && <InputError>{error}</InputError>}
    </div>
  );
};

export { Input };
