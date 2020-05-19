import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const EvenVerticalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame top={0} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame top={50} flip={flip ? 1 : 0} src={urls[1]} />
  </>
);

export { EvenVerticalSplit };
