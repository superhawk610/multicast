import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { Page } from '../components/Page';

import { ChannelForm } from '../forms/ChannelForm';

import routes from '../routes';
import { CHANNEL } from '../graphql/queries';

export const ManageChannel = ({
  match,
}: RouteComponentProps<{ id: string }>) => {
  const { id } = match.params;
  const { data: channel, error, loading } = useQuery(CHANNEL, {
    variables: { id },
  });

  if (loading) return 'Loading...';
  if (error || !channel) return <Redirect to="/404" />;

  return (
    <Page
      heading="Manage Channel"
      subheading={channel.name}
      parent={routes.Channels}
    >
      <ChannelForm />
    </Page>
  );
};
