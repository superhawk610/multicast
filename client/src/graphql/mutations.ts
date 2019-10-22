import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation Login($token: String!) {
    validateLogin(token: $token)
  }
`;

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

export const UPDATE_DEVICE = gql`
  mutation UpdateDevice($id: ID!, $changes: DeviceUpdateInput!) {
    updateDevice(id: $id, changes: $changes) {
      id
      nickname
      rotation
    }
  }
`;

export const REGISTER_DEVICE = gql`
  mutation RegisterDevice($id: ID!) {
    registerDevice(id: $id) {
      id
      registered
    }
  }
`;

export const UNREGISTER_DEVICE = gql`
  mutation UnregisterDevice($id: ID!) {
    unregisterDevice(id: $id) {
      id
      registered
    }
  }
`;

export const CONNECT_DEVICE = gql`
  mutation ConnectDevice($id: ID!) {
    connect(id: $id)
  }
`;

export const CONNECT_ALL_DEVICES = gql`
  mutation ConnectAllDevices {
    connectAll
  }
`;

export const CREATE_ALERT = gql`
  mutation CreateAlert($options: AlertCreateInput!) {
    createAlert(options: $options) {
      id
    }
  }
`;
