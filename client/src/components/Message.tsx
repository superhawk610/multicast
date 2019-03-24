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

interface Props {
  theme?: MessageTheme;
  heading?: string;
  text: React.ReactNode;
}

const Message = ({ theme = THEMES.none, heading, text }: Props) => (
  <Container className={`message ${theme}`}>
    {heading && (
      <div className="message-header">
        <p>{heading}</p>
      </div>
    )}
    <Body className="message-body">{text}</Body>
  </Container>
);

const Container = styled.article`
  width: calc(100% - 3rem);
  max-width: 600px;
`;

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

export { Message };
