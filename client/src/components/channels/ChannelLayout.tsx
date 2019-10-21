import * as React from 'react';
import styled from 'styled-components';

import { Single } from './layouts/Single';
import { EvenVerticalSplit } from './layouts/EvenVerticalSplit';
import { EvenHorizontalSplit } from './layouts/EvenHorizontalSplit';
import { OneTwoVerticalSplit } from './layouts/OneTwoVerticalSplit';
import { OneTwoHorizontalSplit } from './layouts/OneTwoHorizontalSplit';
import { TwoOneVerticalSplit } from './layouts/TwoOneVerticalSplit';
import { TwoOneHorizontalSplit } from './layouts/TwoOneHorizontalSplit';
import { OneOneTwoVerticalSplit } from './layouts/OneOneTwoVerticalSplit';
import { OneOneTwoHorizontalSplit } from './layouts/OneOneTwoHorizontalSplit';
import { TwoOneOneVerticalSplit } from './layouts/TwoOneOneVerticalSplit';
import { TwoOneOneHorizontalSplit } from './layouts/TwoOneOneHorizontalSplit';

import { ChannelLayout, DeviceRotation } from '../../types';

export interface LayoutProps {
  flip: boolean;
  urls: string[];
}

interface ComponentMap {
  [layout: string]: React.SFC<LayoutProps>;
}

interface Props {
  layout: ChannelLayout;
  urls: string[][];
  rotation: DeviceRotation;
}

const layouts: ComponentMap = {
  single: Single,
  '1-1-vertical': EvenVerticalSplit,
  '1-1-horizontal': EvenHorizontalSplit,
  '1-2-vertical': OneTwoVerticalSplit,
  '1-2-horizontal': OneTwoHorizontalSplit,
  '2-1-vertical': TwoOneVerticalSplit,
  '2-1-horizontal': TwoOneHorizontalSplit,
  '2-1-1-vertical': TwoOneOneVerticalSplit,
  '2-1-1-horizontal': TwoOneOneHorizontalSplit,
  '1-1-2-vertical': OneOneTwoVerticalSplit,
  '1-1-2-horizontal': OneOneTwoHorizontalSplit,
};

function transformForRotation(rotation: DeviceRotation) {
  switch (rotation) {
    case 0:
      return ['bottom left', 'rotate(0deg)'];
    case 90:
      return ['bottom left', 'rotate(90deg) translateX(-100vw)'];
    case 180:
      return ['bottom left', 'rotate(180deg) translate(-100vw, 100vh)'];
    case 270:
      return ['top right', 'rotate(270deg) translateY(-100vh)'];
  }
}

const ChannelLayout = ({ layout, urls: pages, rotation }: Props) => {
  const Component = layouts[layout];
  const urls = pages[0];
  const flip = rotation === 90 || rotation === 270;
  const [transformOrigin, transform] = transformForRotation(rotation);

  return (
    <HideOverflow>
      <Rotate flip={flip ? 1 : 0} transform={transform} transformOrigin={transformOrigin}>
        <Component flip={flip} urls={urls} />
      </Rotate>
    </HideOverflow>
  );
};

const HideOverflow = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Rotate = styled.div<{ flip: number; transform: string; transformOrigin: string }>`
  transform: ${props => props.transform};
  transform-origin: ${props => props.transformOrigin};
  width: ${props => (props.flip ? '100vh' : '100vw')};
  height: ${props => (props.flip ? '100vw' : '100vh')};
`;

export { ChannelLayout };
