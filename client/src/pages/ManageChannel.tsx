import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Page } from '../components/Page';
import { ChannelForm } from '../forms/ChannelForm';

import routes from '../routes';

const ManageChannel = ({ match }: RouteComponentProps<{ id: string }>) => (
  <Page heading="Manage Channel" parent={routes.Channels}>
    <ChannelForm id={parseInt(match.params.id)} />
  </Page>
);

export { ManageChannel };
