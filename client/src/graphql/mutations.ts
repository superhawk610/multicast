import gql from 'graphql-tag';

export const UPDATE_CONFIGURATION = gql`
  mutation UpdateConfiguration($changes: ConfigurationUpdateInput!) {
    updateConfiguration(changes: $changes) {
      home
      port
      scanningFrequency
      playgroundEnabled
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation CreateChannel($model: ChannelCreateInput!) {
    createChannel(model: $model) {
      id
      name
      layout
      duration
      urls
    }
  }
`;

export const UPDATE_CHANNEL = gql`
  mutation UpdateChannel($id: ID!, $changes: ChannelUpdateInput!) {
    updateChannel(id: $id, changes: $changes) {
      id
      name
      layout
      duration
      urls
    }
  }
`;

export const DELETE_CHANNEL = gql`
  mutation DeleteChannel($id: ID!) {
    deleteChannel(id: $id) {
      ok
      model {
        id
      }
    }
  }
`;
