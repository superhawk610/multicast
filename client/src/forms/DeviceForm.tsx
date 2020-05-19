import * as React from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useBooleanState } from '../hooks/useBooleanState';

import { AppContext } from '../AppProvider';

import { AlertModal } from './AlertModal';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Form } from '../components/Form';
import { Select } from '../components/Select';
import { ButtonGroup, Button as BGButton } from '../components/ButtonGroup';

import { THEMES } from '../constants';
import { externalLink } from 'react-icons-kit/feather/externalLink';
import { Device, DeviceRotation, Channel } from '../types';
import { CHANNELS } from '../graphql/queries';
import {
  UPDATE_DEVICE,
  REGISTER_DEVICE,
  UNREGISTER_DEVICE,
  CONNECT_DEVICE,
} from '../graphql/mutations';
import {
  updateCacheAfterRegister,
  updateCacheAfterUpdate,
  updateCacheAfterUnregister,
  updateCacheAfterConnect,
} from './updaters/device';

interface Props {
  device: Device;
}

const rotationButtons: BGButton<DeviceRotation>[] = [
  { text: 'None', value: 0, theme: THEMES.dark },
  { text: '90°', value: 90, theme: THEMES.dark },
  { text: '180°', value: 180, theme: THEMES.dark },
  { text: '270°', value: 270, theme: THEMES.dark },
];

const DeviceForm = ({ device }: Props) => {
  const [nickname, setNickname] = React.useState(device.nickname);
  const [rotation, setRotation] = React.useState(device.rotation);
  const [channel, setChannel] = React.useState(device.channel ? device.channel.id : -1);
  const [alertModalActive, toggleAlertModal] = useBooleanState();
  const ctx = React.useContext(AppContext);

  const [getChannels, channelQuery] = useLazyQuery(CHANNELS);
  const [updateDevice, updateMutation] = useMutation(UPDATE_DEVICE, {
    update: updateCacheAfterUpdate(ctx),
    variables: { id: device.id, changes: { nickname, rotation } },
  });
  const [registerDevice, registerMutation] = useMutation(REGISTER_DEVICE, {
    update: updateCacheAfterRegister(ctx),
    variables: { id: device.id },
  });
  const [unregisterDevice, unregisterMutation] = useMutation(UNREGISTER_DEVICE, {
    update: updateCacheAfterUnregister(ctx),
    variables: { id: device.id },
  });
  const [connectDevice, connectMutation] = useMutation(CONNECT_DEVICE, {
    update: updateCacheAfterConnect(ctx),
    variables: { id: device.id },
  });
  const viewDevice = () => window.open(`/landing?device=${device.id}`, '_blank', 'noopener');

  React.useEffect(() => {
    if (device.registered) getChannels();
  }, []);

  const onSubmit = () => {
    console.table({ identifier: device.identifier, nickname, rotation });
  };

  if (!device.registered) {
    return (
      <>
        <Input disabled label="Identifier" defaultValue={device.identifier} />
        <Input disabled label="Nickname" defaultValue={nickname} />
        <Button adjacent text="Register Device" theme={THEMES.success} onClick={registerDevice} />
        <Button text="Connect Device" theme={THEMES.info} onClick={connectDevice} />
      </>
    );
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input disabled label="Identifier" defaultValue={device.identifier} />
      <Input name="nickname" label="Nickname" value={nickname} onChange={setNickname} />
      <label className="label">Rotation</label>
      <ButtonGroup buttons={rotationButtons} value={rotation} onChange={setRotation} />
      <Select
        label="Channel"
        loading={channelQuery.loading}
        value={channel.toString()}
        onChange={v => setChannel(parseInt(v))}
        options={[
          { name: 'none', value: -1 },
          ...(!channelQuery.data
            ? []
            : channelQuery.data.channels.map((channel: Channel) => ({
                name: channel.name,
                value: channel.id,
              }))),
        ]}
      />
      <Button adjacent text="Update Device" theme={THEMES.success} onClick={updateDevice} />
      <Button adjacent text="Reconnect Device" theme={THEMES.warning} onClick={connectDevice} />
      <Button adjacent text="Create Alert" theme={THEMES.info} onClick={toggleAlertModal} />
      <Button text="Unregister Device" theme={THEMES.danger} onClick={unregisterDevice} />
      <Button
        style={{ float: 'right' }}
        leftIcon={externalLink}
        text="View"
        theme={THEMES.light}
        onClick={viewDevice}
      />
      <AlertModal id={device.id} active={alertModalActive} onClose={toggleAlertModal} />
    </Form>
  );
};

export { DeviceForm };
