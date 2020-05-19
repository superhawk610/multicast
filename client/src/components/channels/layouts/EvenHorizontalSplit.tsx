import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const EvenHorizontalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame left={0} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame left={50} flip={flip ? 1 : 0} src={urls[1]} />
  </>
);

export { EvenHorizontalSplit };
