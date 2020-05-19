import styled from 'styled-components';

const Frame = styled.iframe<{
  flip: number;
  top?: number;
  left?: number;
  height?: number;
  width?: number;
}>`
  display: block;
  position: fixed;
  top: ${props => `${props.top || 0}${props.flip ? 'vw' : 'vh'}`};
  left: ${props => `${props.left || 0}${props.flip ? 'vh' : 'vw'}`};
  width: ${props => `${props.width || 100}${props.flip ? 'vh' : 'vw'}`};
  height: ${props => `${props.height || 100}${props.flip ? 'vw' : 'vh'}`};
`;

export { Frame };
