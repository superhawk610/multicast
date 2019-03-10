import * as React from 'react';
import styled from 'styled-components';

interface Props {
  color?: string;
  className?: string;
  onClick?: () => void;
  [x: string]: any;
}

export const Box = ({
  color,
  className = '',
  onClick,
  ...delegated
}: Props) => (
  <AccentedBox
    color={color}
    className={`box ${className}`}
    onClick={onClick}
    {...delegated}
  />
);

const AccentedBox = styled.div<{ color?: string; onClick?: () => void }>`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};

  ${props =>
    props.color &&
    `
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: ${props.color};
    }
  `};
`;
