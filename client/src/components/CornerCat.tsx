import * as React from 'react';
import styled from 'styled-components';

import cat from '../images/cat.png';

interface Props {
  in: boolean;
}

export const CornerCat = (props: Props) => {
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>();

  React.useEffect(() => {
    ref.current && ref.current.scrollTop; // tslint:disable-line:no-unused-expression
    setMounted(true);
  }, []);

  const animated = !mounted ? false : props.in ? true : false;
  const style = {
    opacity: animated ? 1 : 0,
    transform: `rotate(${animated ? 0 : 3}deg) translate(${
      animated ? '0, 0' : '10px, 10px'
    }`,
  };

  // FIXME: tracking at https://github.com/DefinitelyTyped/DefinitelyTyped/issues/28884
  return <Image ref={ref as any} style={style} src={cat} />;
};

const Image = styled.img`
  position: fixed;
  bottom: -40px;
  right: -25px;
  width: 200px;
  transition: transform 800ms cubic-bezier(0.61, 0.42, 0.25, 1.47),
    opacity 300ms ease-out;
  pointer-events: none;
`;

export default CornerCat;
