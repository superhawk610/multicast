import styled from 'styled-components';

export const ThickenSvg = styled.div<{ width?: number }>`
  svg {
    stroke-width: ${props => props.width || 3}px;
  }
`;
