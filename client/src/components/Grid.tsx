import * as React from 'react';

const Row = (props: any) => <div className="columns" {...props} />;

interface Props {
  width?: number;
  [x: string]: any;
}
const Column = ({ width, ...delegated }: Props) => (
  <div className={`column ${width ? `is-${width}` : ''}`} {...delegated} />
);

export { Row, Column };
