import * as React from 'react';
import { useSubscription, useQuery } from 'react-apollo-hooks';

import { Page } from '../components/Page';
import { Heading2 } from '../components/Heading';
import { Device } from '../components/Device';
import { CornerCat } from '../components/CornerCat';

import { COLORS } from '../constants';
import { Device as DeviceType } from '../types';
import { DEVICES } from '../graphql/queries';
import { SUB_DEVICES } from '../graphql/subscriptions';

const Devices = () => {
  const {
    data: { devices: initialDevices = [] },
    error: initialError,
    loading: initialLoading,
  } = useQuery(DEVICES);
  const {
    data: { devices: liveDevices } = {},
    error: liveError,
    loading: liveLoading,
  } = useSubscription(SUB_DEVICES);

  const devices = liveDevices || initialDevices;
  const error = initialError || liveError;

  if (initialLoading) {
    return <div className="with-loading-spinner">Loading...</div>;
  }

  return (
    <Page heading="Devices" subheading="Available Devices">
      {error && (
        <div style={{ padding: '25px' }}>
          <Heading2 color={COLORS.red}>Oops! We encountered an error.</Heading2>
          {error.message}
        </div>
      )}
      <div>
        {devices.map((device: DeviceType, index: number) => (
          <Device key={index} {...device} />
        ))}
      </div>
      {devices.length === 0 && (
        <div style={{ padding: '25px' }}>
          <Heading2>There's nothing here!</Heading2>
          Make sure to follow the setup guide to get your developer devices to
          show up here.
        </div>
      )}
      <CornerCat in={!initialLoading && !liveLoading && devices.length === 0} />
    </Page>
  );
};

export { Devices };
