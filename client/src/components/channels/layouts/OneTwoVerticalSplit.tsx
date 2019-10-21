import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const OneTwoVerticalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame top={0} height={33.333} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame top={33.333} height={66.667} flip={flip ? 1 : 0} src={urls[1]} />
  </>
);

export { OneTwoVerticalSplit };
