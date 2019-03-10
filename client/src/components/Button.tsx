import * as React from 'react';

import Icon from 'react-icons-kit';

import { Themes, THEMES } from '../constants';

export type ButtonTheme =
  | Themes.none
  | Themes.white
  | Themes.light
  | Themes.dark
  | Themes.black
  | Themes.text
  | Themes.primary
  | Themes.link
  | Themes.info
  | Themes.success
  | Themes.warning
  | Themes.danger;

interface Props {
  block?: boolean;
  adjacent?: boolean;
  submit?: boolean;
  text: string;
  onClick?: () => void;
  theme?: ButtonTheme | '';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  style?: {};
}

const Button = ({
  block,
  adjacent,
  submit,
  text,
  onClick,
  theme = THEMES.none,
  disabled,
  loading,
  leftIcon,
  rightIcon,
  style,
  ...delegated
}: Props) => {
  const className = `button ${block ? 'is-fullwidth' : ''} ${theme} ${
    loading ? 'is-loading' : ''
  }`;

  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={className}
      disabled={disabled}
      onClick={onClick}
      style={{
        marginRight: adjacent ? '10px' : 0,
        ...style,
      }}
      {...delegated}
    >
      {leftIcon && <Icon icon={leftIcon} style={{ margin: '0 5px 2px 0' }} />}
      <span>{text}</span>
      {rightIcon && <Icon icon={rightIcon} style={{ margin: '0 0 2px 5px' }} />}
    </button>
  );
};

export { Button };
