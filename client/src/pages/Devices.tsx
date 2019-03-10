import * as React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { Page } from '../components/Page';
import { Heading2 } from '../components/Heading';
import { Device } from '../components/Device';
import { CornerCat } from '../components/CornerCat';

import { COLORS } from '../constants';
import { Device as DeviceType } from '../types';
import { DEVICES } from '../graphql/queries';

export const Devices = () => {
  const { data: devices, error, loading } = useQuery(DEVICES);

  return (
    <Page heading="Devices" subheading="Available Devices">
      {error ? (
        <div style={{ padding: '25px' }}>
          <Heading2 color={COLORS.red}>Oops! We encountered an error.</Heading2>
          {error.message}
        </div>
      ) : loading ? (
        <div className="with-loading-spinner">Loading...</div>
      ) : devices.length > 0 ? (
        <div>
          {devices.map((device: DeviceType, index: number) => (
            <Device key={index} {...device} />
          ))}
        </div>
      ) : (
        <div>
          <div>No Existing Deployments.</div>
          <Link to="/configuration">Register One Here</Link>
        </div>
      )}
      <CornerCat in={loading ? false : devices.length > 0 ? false : true} />
    </Page>
  );
};
