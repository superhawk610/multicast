import styled from 'styled-components';

import { COLORS } from '../constants';

const Heading = styled.h1`
  font-size: 1.8em;
  font-weight: 700;
`;

const Heading2 = styled.h2<{ color?: string }>`
  font-size: 1.2em;
  font-weight: 700;
  color: ${props => props.color || COLORS.green};
  margin-bottom: 25px;
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 3px;
    background: ${COLORS.white3};
  }
`;

export { Heading, Heading2 };
