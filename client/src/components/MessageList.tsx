import * as React from 'react';
import styled from 'styled-components';

import { Message } from './Message';

import { THEMES } from '../constants';
import { Message as MessageType } from '../AppProvider';
import { Alert } from '../types';

interface Props {
  messages: Array<MessageType | Alert>;
  compact?: boolean;
}

const MessageList = ({ messages, compact }: Props) => (
  <Container compact={compact ? 1 : 0}>
    {messages
      .filter(m => m.body.trim())
      .map((message, idx) => {
        const messageProps = {
          key: idx,
          theme: message.theme || THEMES.info,
          heading: message.title,
          text: message.body,
        };

        return <Message {...messageProps} />;
      })}
  </Container>
);

const Container = styled.div<{ compact: number }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.compact ? 'flex-start' : 'center')};
  justify-content: flex-end;
  padding: 1.5rem;
  pointer-events: none;

  > article {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    opacity: 0.5;
    ${props => (props.compact ? 'max-width: 200px;' : '')}

    &:last-child {
      opacity: 1;
    }

    &:nth-last-child(2) {
      opacity: 0.9;
    }

    &:nth-last-child(3) {
      opacity: 0.8;
    }

    &:nth-last-child(4) {
      opacity: 0.7;
    }

    &:nth-last-child(5) {
      opacity: 0.6;
    }
  }
`;

export { MessageList };
