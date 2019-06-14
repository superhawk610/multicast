import * as React from 'react';
import { useInput } from '../hooks/useInput';
import { useBooleanState } from '../hooks/useBooleanState';

import { AlertForm } from './AlertForm';

import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { InlineHeading } from '../components/Heading';
import { ButtonGroup, Button as BGButton } from '../components/ButtonGroup';

import { THEMES, COLORS } from '../constants';
import { Device, DeviceRotation } from '../types';

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
  const [identifier] = React.useState(device.identifier);
  const [nickname, onChangeNickname] = useInput(device.nickname);
  const [rotation, onChangeRotation] = useInput(device.rotation);
  const [alertModalActive, toggleAlertModal] = useBooleanState();

  return (
    <>
      <Input disabled label="Identifier" defaultValue={identifier} />
      <Input name="nickname" label="Nickname" value={nickname} onChange={onChangeNickname} />
      <label className="label">Rotation</label>
      <ButtonGroup buttons={rotationButtons} value={rotation} onChange={onChangeRotation} />
      <InlineHeading color={COLORS.greyLight}>Actions:</InlineHeading>
      <Button adjacent text="Update Device" theme={THEMES.success} onClick={() => {}} />
      <Button adjacent text="Reconnect Device" theme={THEMES.warning} onClick={() => {}} />
      <Button text="Create Alert" theme={THEMES.info} onClick={toggleAlertModal} />
      <Modal
        active={alertModalActive}
        heading="Create Alert"
        onClose={toggleAlertModal}
        onSubmit={() => {}}
      >
        <AlertForm id={device.id} />
      </Modal>
    </>
  );
};

export { DeviceForm };
