import styled from 'styled-components';

const ThickenSvg = styled.div<{ width?: number }>`
  svg {
    stroke-width: ${props => props.width || 3}px;
  }
`;

export { ThickenSvg };
