import * as React from 'react';
import styled from 'styled-components';
import { colorForStatus } from '../utils';

import { DeviceStatus } from '../types';

interface Props {
  status: DeviceStatus;
  text?: string;
}

const StatusLight = ({ status, text = status }: Props) => (
  <div>
    <Light color={colorForStatus(status)} />
    <span>{text}</span>
  </div>
);

const Light = styled.div<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: ${props => props.color};
  box-shadow: 0 0 3px ${props => props.color};
  margin: 0 10px -1px 0;
`;

export { StatusLight };
