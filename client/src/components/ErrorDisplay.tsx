import * as React from 'react';
import styled from 'styled-components';

import { Heading2 } from './Heading';

import Icon from 'react-icons-kit';
import { alertCircle } from 'react-icons-kit/feather/alertCircle';

import { COLORS } from '../constants';

import { PixelShifter } from './PixelShifter';

interface Props {
  error: Error;
}

export const ErrorDisplay = ({ error }: Props) => (
  <Container>
    <ErrorHeading>
      <PixelShifter up={2}>
        <Icon icon={alertCircle} size={24} style={{ marginRight: '5px' }} />
      </PixelShifter>
      <span>Oops! We encountered an error.</span>
    </ErrorHeading>
    {error.message}
  </Container>
);

const Container = styled.div`
  padding: 25px;
  margin-bottom: 25px;
`;

const ErrorHeading = styled(Heading2)`
  color: ${COLORS.red};
`;
