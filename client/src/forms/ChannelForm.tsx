import * as React from 'react';
import { useInput } from '../hooks/useInput';
import { useInputArray } from '../hooks/useInputArray';

import { Form } from '../components/Form';
import { Row, Column } from '../components/Grid';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ButtonGroup, Button as BGButton } from '../components/ButtonGroup';
import { ChannelLayoutPicker } from '../components/ChannelLayoutPicker';
import { ErrorDisplay } from '../components/ErrorDisplay';

import { THEMES } from '../constants';

import { ChannelLayout } from '../types';

interface Props {
  id?: number;
}

const durationButtons: BGButton<number>[] = [
  { text: 'Indefinite', value: 0 },
  { text: '1m', value: 60 * 1000 },
  { text: '5m', value: 5 * 60 * 1000 },
  { text: '10m', value: 10 * 60 * 1000 },
  { text: '15m', value: 15 * 60 * 1000 },
  { text: '30m', value: 30 * 60 * 1000 },
  { text: '1h', value: 60 * 60 * 1000 },
];

export const ChannelForm = ({ id }: Props) => {
  const [name, onChangeName] = useInput('');
  const [layout, onChangeLayout] = useInput<ChannelLayout>('single');
  const [duration, onChangeDuration] = useInput(0);
  const [urls, onChangeUrlAtIndex, { setInputCount }] = useInputArray(
    '',
    '',
    '',
  );

  const layoutChangeHandler = (
    newValue: ChannelLayout,
    urlSlotCount: number,
  ) => {
    onChangeLayout(newValue);
    setInputCount(urlSlotCount);
  };

  // TODO: implement GraphQL mutation
  const loading = false;
  const error = null;
  const onSubmit = () => {
    // perform create mutation
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Column width={4}>
          <Input
            name="name"
            label="Name"
            placeholder="Channel Name"
            value={name}
            onChange={onChangeName}
          />
        </Column>
        <Column width={8}>
          <label className="label">Duration</label>
          <ButtonGroup
            buttons={durationButtons}
            value={duration}
            onChange={onChangeDuration}
          />
        </Column>
      </Row>
      <ChannelLayoutPicker layout={layout} onChange={layoutChangeHandler}>
        <label className="label">URL(s)</label>
        {urls.map((url, index) => (
          <Input
            key={index}
            name={`url-${index}`}
            placeholder={`URL ${index + 1}`}
            value={url}
            onChange={React.useCallback(
              (newValue: string) => onChangeUrlAtIndex(index, newValue),
              [],
            )}
          />
        ))}
      </ChannelLayoutPicker>
      {error && <ErrorDisplay error={error} />}
      <Button submit loading={loading} theme={THEMES.success} text="Save" />
    </Form>
  );
};
