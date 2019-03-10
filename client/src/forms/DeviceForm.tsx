import * as React from 'react';
import { useInput } from '../hooks/useInput';
import { useBooleanState } from '../hooks/useBooleanState';

import { AlertForm } from './AlertForm';

import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { ButtonGroup, Button as BGButton } from '../components/ButtonGroup';

import { THEMES } from '../constants';

interface Props {
  id?: number;
}

const rotationButtons: BGButton<number>[] = [
  { text: 'None', value: 0, theme: THEMES.dark },
  { text: '90°', value: 90, theme: THEMES.dark },
  { text: '180°', value: 180, theme: THEMES.dark },
  { text: '270°', value: 270, theme: THEMES.dark },
];

const DeviceForm = ({ id }: Props) => {
  const [identifier, setIdentifier] = React.useState('');
  const [nickname, onChangeNickname] = useInput('');
  const [rotation, onChangeRotation] = useInput(0);
  const [alertModalActive, toggleAlertModal] = useBooleanState();

  // TODO: query device info

  return (
    <>
      <Input disabled label="Identifier" defaultValue={identifier} />
      <Input
        name="nickname"
        label="Nickname"
        value={nickname}
        onChange={onChangeNickname}
      />
      <label className="label">Rotation</label>
      <ButtonGroup
        buttons={rotationButtons}
        value={rotation}
        onChange={onChangeRotation}
      />
      <Button
        text="Create Alert"
        theme={THEMES.success}
        onClick={toggleAlertModal}
      />
      <Modal
        active={alertModalActive}
        heading="Create Alert"
        onClose={toggleAlertModal}
        onSubmit={() => {}}
      >
        <AlertForm id={id} />
      </Modal>
    </>
  );
};

export { DeviceForm };
