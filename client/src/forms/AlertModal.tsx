import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';

import { Message, MessageTheme } from '../components/Message';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { ButtonGroup, Button } from '../components/ButtonGroup';
import { Spacer } from '../components/Spacer';

import { THEMES } from '../constants';
import { DEVICES } from '../graphql/queries';
import { Device } from '../types';
import { CREATE_ALERT } from '../graphql/mutations';
import { updateCacheAfterCreate } from './updaters/alert';
import { AppContext } from '../AppProvider';

interface Props {
  id?: number;
  active: boolean;
  onClose: () => void;
}

const themeButtons: Button<MessageTheme>[] = [
  { text: 'None', value: '' },
  { text: 'Dark', value: THEMES.dark },
  { text: 'Primary', value: THEMES.primary, theme: THEMES.primary },
  { text: 'Link', value: THEMES.link, theme: THEMES.link },
  { text: 'Info', value: THEMES.info, theme: THEMES.info },
  { text: 'Success', value: THEMES.success, theme: THEMES.success },
  { text: 'Warning', value: THEMES.warning, theme: THEMES.warning },
  { text: 'Danger', value: THEMES.danger, theme: THEMES.danger },
];

const durationButtons: Button<number>[] = [
  { text: '1m', value: 60 * 1000 },
  { text: '5m', value: 5 * 60 * 1000 },
  { text: '30m', value: 30 * 60 * 1000 },
  { text: '1h', value: 60 * 60 * 1000 },
  { text: '12h', value: 12 * 60 * 60 * 1000 },
  { text: '24h', value: 24 * 60 * 60 * 1000 },
];

const AlertModal = ({ id, active, onClose }: Props) => {
  const [deviceId, setDeviceId] = React.useState(id ? id.toString() : 'all');
  const [heading, setHeading] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [theme, setTheme] = React.useState<MessageTheme>(THEMES.primary);
  const [duration, setDuration] = React.useState(60 * 1000);
  const ctx = React.useContext(AppContext);

  const { data, error, loading } = useQuery(DEVICES);
  const [createAlert, createMutation] = useMutation(CREATE_ALERT, {
    update: updateCacheAfterCreate(ctx),
    variables: {
      options: {
        title: heading,
        body: message,
        theme,
        duration,
        device: deviceId === 'all' ? null : deviceId,
      },
    },
  });

  React.useEffect(() => {
    if (createMutation.called && !createMutation.loading && !createMutation.error) {
      onClose();
    }
  }, [createMutation.loading]);

  const devices: Device[] = (data && data.devices) || [];

  return (
    <Modal
      accent={createMutation.loading && 'Loading...'}
      heading="Create Alert"
      onSubmit={createAlert}
      active={active}
      onClose={onClose}
    >
      <Select
        label="Device"
        name="identifier"
        value={deviceId}
        onChange={setDeviceId}
        options={
          loading || error
            ? []
            : [
                { name: 'All Devices', value: 'all' },
                ...devices
                  .filter(d => d.registered)
                  .map(d => ({
                    name: d.nickname,
                    value: d.id.toString(),
                  })),
              ]
        }
      />
      <Spacer />
      <FullWidth>
        <Message theme={theme} heading={heading} text={message || 'Alert Body'} />
      </FullWidth>
      <Spacer />
      <Input
        placeholder="Alert Heading"
        label="Heading"
        name="heading"
        value={heading}
        onChange={setHeading}
      />
      <TextArea
        placeholder="Alert Body"
        label="Message"
        name="message"
        value={message}
        onChange={setMessage}
      />
      <Spacer />
      <label className="label">Theme</label>
      <ButtonGroup buttons={themeButtons} value={theme} onChange={setTheme} />
      <label className="label">Duration</label>
      <ButtonGroup buttons={durationButtons} value={duration} onChange={setDuration} />
    </Modal>
  );
};

const FullWidth = styled.div`
  > article {
    max-width: auto !important;
    width: 100% !important;
  }
`;

export { AlertModal };
