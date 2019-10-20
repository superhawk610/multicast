import * as React from 'react';
import { useBooleanState } from '../hooks/useBooleanState';
import { useQueryThenSubscription } from '../hooks/useQueryThenSubscription';
import styled from 'styled-components';

import { AppContext } from '../AppProvider';

import { Page } from '../components/Page';
import { Heading2, Heading3 } from '../components/Heading';
import { Device } from '../components/Device';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { CornerCat } from '../components/CornerCat';
import { Spacer } from '../components/Spacer';

import { AlertForm } from '../forms/AlertForm';

import Icon from 'react-icons-kit';
import { helpCircle } from 'react-icons-kit/feather/helpCircle';
import { arrowRightCircle } from 'react-icons-kit/feather/arrowRightCircle';

import { COLORS, THEMES } from '../constants';
import { Device as DeviceType } from '../types';
import { DEVICES } from '../graphql/queries';
import { SUB_DEVICES } from '../graphql/subscriptions';

const Devices = () => {
  const [alertModalActive, toggleAlertModal] = useBooleanState();

  const { showDialog } = React.useContext(AppContext);
  const onStartTakeover = () => showDialog();

  const { data: devices, loading, queryLoading, error } = useQueryThenSubscription<DeviceType>(
    DEVICES,
    SUB_DEVICES,
    'devices',
  );

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
      {error && (
        <div style={{ padding: '25px' }}>
          <Heading2 color={COLORS.red}>Oops! We encountered an error.</Heading2>
          {error.message}
        </div>
      )}
      {registeredDevices.length > 0 ? (
        registeredDevices.map((device, idx) => (
          <React.Fragment key={idx}>
            <Buttons>
              <Button adjacent text="Create Alert" theme={THEMES.info} onClick={toggleAlertModal} />
              <Button text="Start Takeover" theme={THEMES.danger} onClick={onStartTakeover} />
            </Buttons>
            <Spacer />
            <Device {...device} />
          </React.Fragment>
        ))
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
      <Modal
        active={alertModalActive}
        heading="Create Alert"
        onClose={toggleAlertModal}
        onSubmit={() => {}}
      >
        <AlertForm />
      </Modal>
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
