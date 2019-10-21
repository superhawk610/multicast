import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const OneTwoHorizontalSplit = ({ flip, urls }: LayoutProps) => (
  <>
    <Frame left={0} width={33.333} flip={flip ? 1 : 0} src={urls[0]} />
    <Frame left={33.333} width={66.667} flip={flip ? 1 : 0} src={urls[1]} />
  </>
);

export { OneTwoHorizontalSplit };
