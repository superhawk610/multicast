import * as React from 'react';

export const Row = ({ ...delegated }) => (
  <div className="columns" {...delegated} />
);

interface Props {
  width?: number;
  [x: string]: any;
}
export const Column = ({ width, ...delegated }: Props) => (
  <div className={`column ${width ? `is-${width}` : ''}`} {...delegated} />
);
