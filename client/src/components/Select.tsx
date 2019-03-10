import * as React from 'react';

import { InputError } from './InputError';

import Icon from 'react-icons-kit';

import { Themes, THEMES } from '../constants';

import { InputEvent } from '../types';

type SelectTheme =
  | Themes.primary
  | Themes.info
  | Themes.success
  | Themes.warning
  | Themes.danger;

interface OptionMeta {
  name: string;
  value: string;
}

type Option = OptionMeta | string;

interface Props {
  block?: boolean;
  label?: string;
  placeholder?: string;
  error?: string | null;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  options: Option[];
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  theme?: SelectTheme | '';
}

const Select = ({
  block,
  label,
  placeholder,
  error,
  name,
  value,
  onChange,
  defaultValue,
  options,
  disabled,
  loading,
  icon,
  theme = THEMES.none,
}: Props) => {
  const loadingClass = loading ? 'is-loading' : '';
  const iconClass = icon ? 'has-icons-left' : '';
  const blockClass = block ? 'is-fullwidth' : '';

  const changeHandler = React.useCallback(
    (event: InputEvent<string>) => {
      if (onChange) onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className={`control ${loadingClass} ${iconClass}`}>
        <div className={`select ${blockClass}`}>
          <select
            className={`input ${theme}`}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={changeHandler}
          >
            {options.map((option, index) => {
              const optionName =
                typeof option === 'object' ? option.name : option;
              const optionValue =
                typeof option === 'object' ? option.value : option;

              return (
                <option key={index} value={optionValue}>
                  {optionName}
                </option>
              );
            })}
          </select>
        </div>
        {icon && (
          <span className="icon is-left">
            <Icon icon={icon} />
          </span>
        )}
      </div>
      {error && <InputError>{error}</InputError>}
    </div>
  );
};

export { Select };
