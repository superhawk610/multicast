import * as React from 'react';

interface Props {
  height?: number;
}

const Spacer = ({ height = 20 }: Props) => <div style={{ height: `${height}px` }} />;

export { Spacer };
