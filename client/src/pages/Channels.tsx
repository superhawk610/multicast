import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { Page } from '../components/Page';
import { Heading2 } from '../components/Heading';
import { Table } from '../components/Table';

import { ChannelForm } from '../forms/ChannelForm';

import { Channel } from '../types';
import { CHANNELS } from '../graphql/queries';

const Channels = withRouter(({ history }: RouteComponentProps) => {
  const { data: channels, error, loading } = useQuery(CHANNELS);

  const actionForRow = (row: Channel) => ({
    text: 'Manage',
    onClick: (channel: Channel) => history.push(`/channels/${channel.id}`),
  });

  return (
    <Page heading="Channels" subheading="Active Channels">
      <Table
        data={channels}
        loading={loading}
        error={error}
        headers={['id', 'name']}
        headerLabels={['#', 'Name']}
        actionForRow={actionForRow}
        noRecordsFoundText="No Channels Found."
      />
      <Heading2>Register New Channel</Heading2>
      <ChannelForm />
    </Page>
  );
});

export { Channels };
