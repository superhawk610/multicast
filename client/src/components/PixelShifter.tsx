import * as React from 'react';

interface Props {
  up?: number;
  right?: number;
  down?: number;
  left?: number;
  children?: any;
}

const PixelShifter = ({ up = 0, right = 0, down = 0, left = 0, children }: Props) => (
  <div
    style={{
      display: 'inline-block',
      transform: `translate(${right - left}px, ${down - up}px)`,
    }}
  >
    {children}
  </div>
);

export { PixelShifter };
