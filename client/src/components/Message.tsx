import * as React from 'react';
import styled from 'styled-components';

import { Themes, THEMES } from '../constants';

export type MessageTheme =
  | Themes.none
  | Themes.dark
  | Themes.primary
  | Themes.link
  | Themes.info
  | Themes.success
  | Themes.warning
  | Themes.danger;

export type MessageStyle = 'bold' | 'minimal';

interface Props {
  theme?: MessageTheme;
  style?: MessageStyle;
  heading?: string;
  text: React.ReactNode;
}

export const Message = ({
  theme = THEMES.none,
  style = 'bold',
  heading,
  text,
}: Props) => (
  <article className={`message ${theme}`}>
    {style === 'bold' && (
      <div className="message-header">
        <p>{heading}</p>
      </div>
    )}
    <Body className="message-body">{text}</Body>
  </article>
);

const Body = styled.div`
  a {
    display: inline-block;
    position: relative;
    font-weight: 700;
    text-decoration: none !important;

    &::after {
      content: '';
      display: block;
      position: absolute;
      background: currentColor;
      bottom: 1px;
      left: 0;
      width: 100%;
      height: 2px;
      border-radius: 2px;
    }
  }
`;
