import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const TwoOneHorizontalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame left={0} width={66.666} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame left={66.666} width={33.334} flip={flip ? 1 : 0} src={urls[1]} />
  </>
);

export { TwoOneHorizontalSplit };
