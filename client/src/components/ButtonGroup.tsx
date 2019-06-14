import * as React from 'react';

import { ButtonTheme } from './Button';

import { THEMES } from '../constants';

export interface Button<T> {
  text: string;
  theme?: ButtonTheme;
  value: T;
}

interface Props<T> {
  buttons: Button<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

const ButtonGroup = <T extends any = string | number>({ buttons, value, onChange }: Props<T>) => (
  <div className="buttons has-addons">
    {buttons.map(({ text, theme = THEMES.dark, value: buttonValue }, index) => {
      const active = buttonValue === value;
      const onClick = () => onChange(buttonValue);

      return (
        <span
          key={index}
          className={`button ${active ? theme : ''} ${active ? 'is-selected' : ''}`}
          onClick={onClick}
        >
          {text}
        </span>
      );
    })}
  </div>
);

export { ButtonGroup };
