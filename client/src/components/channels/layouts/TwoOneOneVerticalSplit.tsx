import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const TwoOneOneVerticalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame top={0} left={0} width={100} height={50} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame top={50} left={0} width={50} height={50} flip={flip ? 1 : 0} src={urls[1]} />
    <Frame top={50} left={50} width={50} height={50} flip={flip ? 1 : 0} src={urls[2]} />
  </>
);

export { TwoOneOneVerticalSplit };
