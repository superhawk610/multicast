import * as React from 'react';

import { ChannelLayout } from './channels/ChannelLayout';

import { Channel, DeviceRotation } from '../types';

interface Props {
  channel: Channel;
  rotation: DeviceRotation;
}

const ChannelDisplay = ({ channel, rotation }: Props) => {
  return <ChannelLayout layout={channel.layout} urls={channel.urls} rotation={rotation} />;
};

export { ChannelDisplay };
