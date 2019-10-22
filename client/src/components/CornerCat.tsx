import * as React from 'react';
import { basePath } from '../utils';
import styled from 'styled-components';

import cat from '../assets/cat.png';

interface Props {
  in: boolean;
}

const CornerCat = (props: Props) => {
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef() as React.MutableRefObject<HTMLImageElement>;

  React.useEffect(() => {
    ref.current && ref.current.scrollTop; // tslint:disable-line:no-unused-expression
    setMounted(true);
  }, []);

  const animated = !mounted ? false : props.in ? true : false;
  const style = {
    opacity: animated ? 1 : 0,
    transform: `rotate(${animated ? 0 : 3}deg) translate(${animated ? '0, 0' : '10px, 10px'}`,
  };

  return <Image ref={ref} style={style} src={basePath(cat)} />;
};

const Image = styled.img`
  position: fixed;
  bottom: -40px;
  right: -25px;
  width: 200px;
  transition: transform 800ms cubic-bezier(0.61, 0.42, 0.25, 1.47), opacity 300ms ease-out;
  pointer-events: none;
`;

export { CornerCat };
