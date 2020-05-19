import * as React from 'react';

import { LayoutProps } from '../ChannelLayout';
import { Frame } from '../Frame';

const Single = ({ flip, urls }: LayoutProps) => <Frame flip={flip ? 1 : 0} src={urls[0]} />;

export { Single };
