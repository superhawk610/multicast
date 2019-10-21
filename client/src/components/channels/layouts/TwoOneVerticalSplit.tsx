import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const TwoOneVerticalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame top={0} height={66.666} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame top={66.666} height={33.334} flip={flip ? 1 : 0} src={urls[1]} />
  </>
);

export { TwoOneVerticalSplit };
