import * as React from 'react';
import { useSubscription, useQuery } from 'react-apollo-hooks';
import { useBooleanState } from '../hooks/useBooleanState';

import { AppContext } from '../AppContext';

import { Page } from '../components/Page';
import { Heading2 } from '../components/Heading';
import { Device } from '../components/Device';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { CornerCat } from '../components/CornerCat';
import { Spacer } from '../components/Spacer';
import { AlertForm } from '../forms/AlertForm';

import { COLORS, THEMES } from '../constants';
import { Device as DeviceType } from '../types';
import { DEVICES } from '../graphql/queries';
import { SUB_DEVICES } from '../graphql/subscriptions';

const Devices = () => {
  const [alertModalActive, toggleAlertModal] = useBooleanState();

  const { showDialog } = React.useContext(AppContext);
  const onStartTakeover = () => showDialog();

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

  const devices: DeviceType[] = liveDevices || initialDevices;
  const error = initialError || liveError;
  const supportedDevices = [];
  const unsupportedDevices = [];

  for (const device of devices) {
    if (device.supported) supportedDevices.push(device);
    else unsupportedDevices.push(device);
  }

  const pageContent = initialLoading ? (
    <div className="with-loading-spinner">Loading...</div>
  ) : (
    <>
      <Button
        adjacent
        text="Create Alert"
        theme={THEMES.success}
        onClick={toggleAlertModal}
      />
      <Button
        text="Start Takeover"
        theme={THEMES.danger}
        onClick={onStartTakeover}
      />
      <Spacer />
      {error && (
        <div style={{ padding: '25px' }}>
          <Heading2 color={COLORS.red}>Oops! We encountered an error.</Heading2>
          {error.message}
        </div>
      )}
      {supportedDevices.map((device: DeviceType, index: number) => (
        <Device key={index} {...device} />
      ))}
      {supportedDevices.length === 0 && (
        <div style={{ padding: '25px' }}>
          <Heading2>There's nothing here!</Heading2>
          Make sure to follow the setup guide to get your developer devices to
          show up here.
        </div>
      )}
      {unsupportedDevices.length > 0 && (
        <>
          <Heading2 color={COLORS.grey}>Unsupported Devices</Heading2>
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
      <CornerCat in={!initialLoading && !liveLoading && devices.length === 0} />
    </>
  );

  return (
    <Page heading="Devices" subheading="Available Devices">
      {pageContent}
    </Page>
  );
};

export { Devices };
