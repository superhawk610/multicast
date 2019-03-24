import * as React from 'react';
import styled from 'styled-components';

import { useAlerts } from '../hooks/useAlerts';

import { Message } from './Message';

const Alerts = () => {
  const { alerts } = useAlerts();

  return (
    <Container>
      {alerts.map((alert, index) => (
        <Message
          key={index}
          heading={alert.title}
          text={alert.body}
          theme={alert.theme}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 1.5rem;

  > article {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    opacity: 0.5;

    &:nth-last-child(1) {
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

export { Alerts };
