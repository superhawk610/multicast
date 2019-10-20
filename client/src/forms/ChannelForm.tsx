import * as React from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useInputArray } from '../hooks/useInputArray';
import { chunk } from '../utils';
import styled from 'styled-components';

import { Form } from '../components/Form';
import { Row, Column } from '../components/Grid';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { ButtonGroup, Button as BGButton } from '../components/ButtonGroup';
import { ChannelLayoutPicker } from '../components/ChannelLayoutPicker';
import { ErrorDisplay } from '../components/ErrorDisplay';

import { plus } from 'react-icons-kit/feather/plus';
import { trash2 } from 'react-icons-kit/feather/trash2';

import { THEMES, COLORS, DURATIONS } from '../constants';
import { ChannelLayout } from '../types';
import { CHANNEL } from '../graphql/queries';
import { CREATE_CHANNEL, UPDATE_CHANNEL, DELETE_CHANNEL } from '../graphql/mutations';
import {
  updateCacheAfterCreate,
  updateCacheAfterUpdate,
  updateCacheAfterDelete,
} from './updaters/channel';

interface Props {
  id?: number;
}

const durationButtons: BGButton<number>[] = [
  { text: 'Indefinite', value: -1 },
  ...Object.entries(DURATIONS).map(([duration, description]) => ({
    text: description,
    value: parseInt(duration),
  })),
];

const ChannelForm = ({ id }: Props) => {
  const [name, setName] = React.useState('');
  const [layout, setLayout] = React.useState<ChannelLayout>('single');
  const [duration, setDuration] = React.useState(-1);
  const [slotCount, setSlotCount] = React.useState(1);
  const [activePage, setActivePage] = React.useState(0);
  const [notFound, setNotFound] = React.useState(false);
  const [
    urls,
    onChangeUrlAtIndex,
    { addInputs, setInputCount, setInputValues, removeInputs },
  ] = useInputArray('');

  const isCreatingNew = typeof id === 'undefined';

  const pages = chunk(urls, slotCount);
  const pageCount = pages.length;

  const [getChannel, getQuery] = useLazyQuery(CHANNEL, { variables: { id } });
  const [createChannel, createMutation] = useMutation(CREATE_CHANNEL, {
    update: updateCacheAfterCreate,
    variables: { model: { name, layout, duration, urls: pages } },
  });
  const [updateChannel, updateMutation] = useMutation(UPDATE_CHANNEL, {
    update: updateCacheAfterUpdate,
    variables: { id, changes: { name, layout, duration, urls: pages } },
  });
  const [deleteChannel, deleteMutation] = useMutation(DELETE_CHANNEL, {
    update: updateCacheAfterDelete,
    variables: { id },
  });

  React.useEffect(() => {
    if (!isCreatingNew) getChannel();
  }, []);

  React.useEffect(() => {
    const { data } = getQuery;

    if (data) {
      if (!data.channel) {
        setNotFound(true);
        return;
      }

      setName(data.channel.name);
      setLayout(data.channel.layout);
      setDuration(data.channel.duration);
      setSlotCount(data.channel.urls[0].length);
      setInputValues(data.channel.urls.flat());
    }
  }, [getQuery.data]);

  React.useEffect(() => {
    if (deleteMutation.called && !deleteMutation.loading && !deleteMutation.error) {
      window.location.replace('/channels');
    }
  }, [deleteMutation.called, deleteMutation.loading]);

  if (!isCreatingNew && notFound) {
    return <>Channel not found</>;
  }

  const saveLoading = getQuery.loading || createMutation.loading || updateMutation.loading;
  const deleteLoading = deleteMutation.loading;
  const error = getQuery.error || createMutation.error || updateMutation.error;

  const onSubmit = () => (isCreatingNew ? createChannel() : updateChannel());

  const layoutChangeHandler = (newValue: ChannelLayout, newSlotCount: number) => {
    setLayout(newValue);
    setSlotCount(newSlotCount);
    setInputCount(pageCount * newSlotCount);
  };

  const addPage = () => {
    addInputs(slotCount);
    setActivePage(pageCount);
  };

  const removePage = () => {
    const newPageCount = pageCount - 1;
    removeInputs(activePage * slotCount, activePage * slotCount + slotCount);
    setActivePage(Math.min(newPageCount - 1, activePage));
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Column width={4}>
          <Input
            required
            name="name"
            label="Name"
            placeholder="Channel Name"
            value={name}
            onChange={setName}
          />
        </Column>
        <Column width={8}>
          <label className="label">
            Duration
            <Info>How long should each page be displayed before rotating to the next?</Info>
          </label>
          <ButtonGroup buttons={durationButtons} value={duration} onChange={setDuration} />
        </Column>
      </Row>
      <ChannelLayoutPicker layout={layout} onChange={layoutChangeHandler}>
        <PageLabel className="label">Page</PageLabel>
        <PageSelect value={activePage} onChange={e => setActivePage(parseInt(e.target.value))}>
          {pages.map((_, idx) => (
            <option key={idx} value={idx}>
              {idx + 1}
            </option>
          ))}
        </PageSelect>
        <PageCount>of {pages.length}</PageCount>
        <IconButton icon={plus} title="add page" onClick={addPage} />
        <IconButton
          icon={trash2}
          title="remove page"
          disabled={pageCount < 2}
          onClick={removePage}
        />
        <label className="label">URL{pages[activePage].length > 1 ? 's' : ''}</label>
        {pages[activePage].map((url, idx) => (
          <Input
            key={idx}
            name={`url-${idx}`}
            placeholder={`URL ${idx + 1}`}
            value={url}
            onChange={(newValue: string) =>
              onChangeUrlAtIndex(activePage * slotCount + idx, newValue)
            }
          />
        ))}
      </ChannelLayoutPicker>
      {error && <ErrorDisplay error={error} />}
      <Button
        adjacent
        submit
        disabled={deleteLoading}
        loading={saveLoading}
        theme={THEMES.success}
        text="Save"
      />
      {!isCreatingNew && (
        <Button
          loading={deleteLoading}
          disabled={saveLoading}
          theme={THEMES.danger}
          text="Delete"
          onClick={deleteChannel}
        />
      )}
    </Form>
  );
};

const Info = styled.span`
  color: ${COLORS.greyLighter};
  margin-left: 0.5rem;
  font-weight: 400;
`;

const PageLabel = styled.label`
  display: inline-block;
  margin-right: 0.5rem;
`;

const PageCount = styled.div`
  display: inline-block;
  transform: translateY(1px);
  margin-right: 0.5rem;
`;

const PageSelect = styled.select`
  border: 1px solid ${COLORS.greyTint};
  border-radius: 1000px;
  outline: 0;
  cursor: pointer;
  padding: 2px 5px;
  margin-right: 0.5rem;
`;

export { ChannelForm };
