import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';

import { Page } from '../components/Page';
import { Heading2 } from '../components/Heading';
import { Table } from '../components/Table';
import { channelLayoutMap } from '../components/ChannelLayoutPicker';

import { ChannelForm } from '../forms/ChannelForm';

import { Channel } from '../types';
import { CHANNELS } from '../graphql/queries';
import { COLORS, DURATIONS } from '../constants';

const Channels = withRouter(({ history }: RouteComponentProps) => {
  const { data, error, loading } = useQuery(CHANNELS);

  const actionForRow = () => ({
    text: 'Manage',
    onClick: (channel: Channel) => history.push(`/channels/${channel.id}`),
  });

  return (
    <Page heading="Channels" subheading="Active Channels">
      <Table
        data={data && data.channels}
        loading={loading}
        error={error}
        headers={['id', 'duration', 'layout', 'name', 'urls']}
        headerLabels={['#', 'Duration', 'Layout', 'Name', 'URLs']}
        renderRow={{
          name: ({ name }: Channel) => <span style={{ whiteSpace: 'nowrap' }}>{name}</span>,
          duration: ({ duration }: Channel) => {
            if (duration === -1) return <span style={{ color: COLORS.greyLight }}>indefinite</span>;
            return DURATIONS[duration] || `${duration}ms`;
          },
          layout: ({ layout }: Channel) => {
            const { Component } = channelLayoutMap[layout];
            return (
              <div style={{ width: '60px' }}>
                <Component compact />
              </div>
            );
          },
          urls: ({ urls }: Channel) => (
            <Slugs>
              {urls.flat().map((url, urlIdx) => {
                const slot = (urlIdx % urls[0].length) + 1;
                const display = url.trim();
                const blank = !display;

                return (
                  <Slug key={urlIdx} blank={blank ? 1 : 0}>
                    {slot}: {display || 'empty'}
                  </Slug>
                );
              })}
            </Slugs>
          ),
        }}
        actionForRow={actionForRow}
        noRecordsFoundText="No Channels Found."
      />
      <Heading2>Register New Channel</Heading2>
      <ChannelForm />
    </Page>
  );
});

const Slugs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
`;

const Slug = styled.span<{ blank?: number }>`
  flex-shrink: 0;
  display: inline-block;
  border-radius: 1000px;
  background: ${COLORS.greyLightest};
  color: ${COLORS.greyDark};
  padding: 2px 10px;
  margin: 0.3rem;
  opacity: ${props => (props.blank ? 0.3 : 1)};
`;

export { Channels };
