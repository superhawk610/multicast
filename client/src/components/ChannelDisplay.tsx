import * as React from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { getInjected } from '../getInjected';

import { Channel, DeviceRotation } from '../types';
import { SUB_UPDATES_Data, SUB_UPDATES_Variables, SUB_UPDATES } from '../graphql/subscriptions';

import { ChannelLayout } from './channels/ChannelLayout';

const device = getInjected('device', null) as string;

interface Props {
  channel: Channel;
  rotation: DeviceRotation;
}

const ChannelDisplay = ({ channel, rotation }: Props) => {
  const updates = useSubscription<SUB_UPDATES_Data, SUB_UPDATES_Variables>(SUB_UPDATES, {
    variables: { device },
  });

  console.log(updates.data);

  return <ChannelLayout layout={channel.layout} urls={channel.urls} rotation={rotation} />;
};

export { ChannelDisplay };
