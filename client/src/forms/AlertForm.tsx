import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { useInput } from '../hooks/useInput';

import { Message, MessageTheme, MessageStyle } from '../components/Message';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Select } from '../components/Select';
import { ButtonGroup, Button } from '../components/ButtonGroup';
import { Spacer } from '../components/Spacer';

import { THEMES } from '../constants';
import { DEVICES } from '../graphql/queries';
import { Device } from '../types';

interface Props {
  id?: number;
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

const styleButtons: Button<MessageStyle>[] = [
  { text: 'Bold', value: 'bold' },
  { text: 'Minimal', value: 'minimal' },
];

const durationButtons: Button<number>[] = [
  { text: '1m', value: 60 * 1000 },
  { text: '5m', value: 5 * 60 * 1000 },
  { text: '30m', value: 30 * 60 * 1000 },
  { text: '1h', value: 60 * 60 * 1000 },
  { text: '12h', value: 12 * 60 * 60 * 1000 },
  { text: '24h', value: 24 * 60 * 60 * 1000 },
];

const AlertForm = ({ id }: Props) => {
  const [deviceId, onChangeDeviceId] = useInput('all');
  const [heading, onChangeHeading] = useInput('');
  const [message, onChangeMessage] = useInput('');
  const [theme, onChangeTheme] = useInput<MessageTheme>(THEMES.primary);
  const [style, onChangeStyle] = useInput<MessageStyle>('bold');
  const [duration, onChangeDuration] = useInput(60 * 1000);

  const {
    data: { devices = [] },
    error,
    loading,
  } = useQuery(DEVICES);

  return (
    <>
      <Select
        label="Device"
        name="identifier"
        value={deviceId}
        onChange={onChangeDeviceId}
        options={
          loading || error
            ? []
            : [
                { name: 'All Devices', value: 'all' },
                ...devices.map((device: Device) => ({
                  name: device.nickname,
                  value: device.id,
                })),
              ]
        }
      />
      <Spacer />
      <Message
        theme={theme}
        style={style}
        heading={heading || 'Alert Heading'}
        text={message || 'Alert Body'}
      />
      <Spacer />
      <Input
        placeholder="Alert Heading"
        label="Heading"
        name="heading"
        value={heading}
        onChange={onChangeHeading}
      />
      <TextArea
        placeholder="Alert Body"
        label="Message"
        name="message"
        value={message}
        onChange={onChangeMessage}
      />
      <Spacer />
      <label className="label">Theme</label>
      <ButtonGroup
        buttons={themeButtons}
        value={theme}
        onChange={onChangeTheme}
      />
      <label className="label">Style</label>
      <ButtonGroup
        buttons={styleButtons}
        value={style}
        onChange={onChangeStyle}
      />
      <label className="label">Duration</label>
      <ButtonGroup
        buttons={durationButtons}
        value={duration}
        onChange={onChangeDuration}
      />
    </>
  );
};

export { AlertForm };
