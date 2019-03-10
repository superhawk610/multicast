import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';

import { PixelShifter } from './PixelShifter';

import Icon from 'react-icons-kit';
import { alertTriangle } from 'react-icons-kit/feather/alertTriangle';

import { COLORS } from '../constants';
import { STATUS } from '../graphql/queries';

const SandboxWarning = () => {
  const {
    data: { status } = { status: { sandbox: false } },
    error,
    loading,
  } = useQuery(STATUS);

  if (error || loading || !status.sandbox) return null;

  return (
    <Container>
      <PixelShifter up={2}>
        <Icon icon={alertTriangle} size={24} style={{ marginRight: '5px' }} />
      </PixelShifter>
      <strong>SANDBOX ENVIRONMENT</strong>
      <div>Changes will not be persisted through server restart.</div>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 25px;
  right: 25px;
  color: ${COLORS.orange};
  text-align: right;

  strong {
    color: ${COLORS.orange};
  }
`;

export { SandboxWarning };
