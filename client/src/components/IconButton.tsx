import * as React from 'react';
import styled from 'styled-components';

import Icon from 'react-icons-kit';

interface Props {
  icon: any;
  size?: number;
  onClick?: () => void;
  rotate?: boolean;
}

const IconButton = ({ icon, size = 24, onClick, rotate, ...delegated }: Props) => (
  <Button rotate={rotate ? 1 : 0} {...delegated}>
    <Icon icon={icon} size={size} onClick={onClick} />
  </Button>
);

const Button = styled.button<{ rotate: number }>`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  &:active {
    transform: ${props => (props.rotate ? 'rotate(20deg)' : 'translateY(1px)')};
  }
`;

export { IconButton };
