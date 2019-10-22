import * as React from 'react';
import { useBooleanState } from '../hooks/useBooleanState';
import { useQueryThenSubscription } from '../hooks/useQueryThenSubscription';
import styled from 'styled-components';

import { AppContext } from '../AppProvider';

import { Page } from '../components/Page';
import { Heading2, Heading3 } from '../components/Heading';
import { Device } from '../components/Device';
import { Button } from '../components/Button';
import { CornerCat } from '../components/CornerCat';
import { Spacer } from '../components/Spacer';

import { AlertModal } from '../forms/AlertModal';

import Icon from 'react-icons-kit';
import { rss } from 'react-icons-kit/feather/rss';
import { loader } from 'react-icons-kit/feather/loader';
import { monitor } from 'react-icons-kit/feather/monitor';
import { helpCircle } from 'react-icons-kit/feather/helpCircle';
import { arrowRightCircle } from 'react-icons-kit/feather/arrowRightCircle';

import { COLORS, THEMES } from '../constants';
import { Device as DeviceType } from '../types';
import { DEVICES } from '../graphql/queries';
import { SUB_DEVICES } from '../graphql/subscriptions';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { useMutation } from '@apollo/react-hooks';
import { CONNECT_ALL_DEVICES } from '../graphql/mutations';

const Devices = () => {
  const [alertModalActive, toggleAlertModal] = useBooleanState();

  const { showDialog } = React.useContext(AppContext);

  // TODO: implement takeovers
  const onStartTakeover = () => showDialog({ body: '🚧 TAKEOVERS ARE UNDER CONSTRUCTION 🚧' });

  const { data: devices, loading, queryLoading, error } = useQueryThenSubscription<DeviceType>(
    DEVICES,
    SUB_DEVICES,
    'devices',
  );

  const [connectAll, connectAllMutation] = useMutation(CONNECT_ALL_DEVICES);

  const registeredDevices: DeviceType[] = [];
  const unregisteredDevices: DeviceType[] = [];
  const unsupportedDevices: DeviceType[] = [];

  for (const device of devices) {
    switch (true) {
      case !device.supported:
        unsupportedDevices.push(device);
        break;
      case !device.registered:
        unregisteredDevices.push(device);
        break;
      default:
        registeredDevices.push(device);
    }
  }

  const pageContent = queryLoading ? (
    <div className="with-loading-spinner">Loading...</div>
  ) : (
    <>
      {error && <ErrorDisplay error={error} />}
      {registeredDevices.length > 0 ? (
        <>
          <Buttons>
            <Button
              adjacent
              leftIcon={monitor}
              text="Create Alert"
              theme={THEMES.info}
              onClick={toggleAlertModal}
            />
            <Button
              adjacent
              leftIcon={rss}
              text="Start Takeover"
              theme={THEMES.dark}
              onClick={onStartTakeover}
            />
            <Button
              loading={connectAllMutation.loading}
              leftIcon={loader}
              text="Connect All Devices"
              theme={THEMES.success}
              onClick={connectAll}
            />
          </Buttons>
          <Spacer />
          {registeredDevices.map((device, idx) => (
            <Device key={idx} {...device} />
          ))}
        </>
      ) : (
        <div style={{ padding: '10px 25px 50px' }}>
          <Heading3>There's nothing here :(</Heading3>
          Make sure to follow the setup guide to get your developer devices to show up here.
          <Spacer />
          <a target="_blank" href="https://superhawk610.github.io/multicast-site/">
            View Documentation <Icon icon={arrowRightCircle} />
          </a>
        </div>
      )}
      {unregisteredDevices.length > 0 && (
        <>
          <Heading2 color={COLORS.grey}>Available Devices</Heading2>
          {unregisteredDevices.map((device: DeviceType, index: number) => (
            <Device key={index} {...device} />
          ))}
        </>
      )}
      {unsupportedDevices.length > 0 && (
        <>
          <Heading2 color={COLORS.grey}>
            Unsupported Devices
            <span title="these devices don't support video streaming">
              <Icon style={{ marginLeft: '0.5rem' }} icon={helpCircle} />
            </span>
          </Heading2>
          {unsupportedDevices.map((device: DeviceType, index: number) => (
            <Device key={index} {...device} />
          ))}
        </>
      )}
      <AlertModal active={alertModalActive} onClose={toggleAlertModal} />
      <CornerCat in={!loading && devices.length === 0} />
    </>
  );

  return (
    <Page heading="Devices" subheading="Registered Devices">
      {pageContent}
    </Page>
  );
};

const Buttons = styled.div`
  display: flex;
  flex-direction: row;

  > button {
    flex: 1;
  }
`;

export { Devices };
