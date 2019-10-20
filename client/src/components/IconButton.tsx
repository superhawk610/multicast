import * as React from 'react';
import styled from 'styled-components';

import Icon from 'react-icons-kit';

interface Props {
  icon: any;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  size?: number;
  onClick?: () => void;
  rotate?: boolean;
  title?: string;
}

const IconButton = ({
  icon,
  disabled,
  type = 'button',
  size = 24,
  onClick,
  rotate,
  ...delegated
}: Props) => (
  <Button disabled={disabled} type={type} rotate={rotate ? 1 : 0} {...delegated}>
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

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export { IconButton };
