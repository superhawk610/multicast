import gql from 'graphql-tag';
import { DeviceRotation, ChannelLayout, Channel, Device } from '../types';

export const DEVICES = gql`
  {
    devices {
      id
      identifier
      registered
      nickname
      address
      model
      supported
      rotation
      status
      channel {
        id
        name
        layout
        duration
        urls
      }
    }
  }
`;

export const DEVICE = gql`
  query Device($id: ID!) {
    device(id: $id) {
      id
      identifier
      rotation
      channel {
        id
        name
        layout
        duration
        urls
      }
    }
  }
`;

export interface DEVICE_Data {
  device: Device;
}

export interface DEVICE_Variables {
  id: number;
}

export const ALERTS = gql`
  {
    alerts {
      title
      body
      theme
      devices
    }
  }
`;

export const CHANNELS = gql`
  {
    channels {
      id
      name
      layout
      duration
      urls
    }
  }
`;

export const CHANNEL = gql`
  query Channel($id: ID!) {
    channel(id: $id) {
      id
      name
      layout
      duration
      urls
    }
  }
`;

export const STATUS = gql`
  {
    status {
      sandbox
    }
  }
`;

export const CONFIGURATION = gql`
  {
    configuration {
      home
      port
      scanningFrequency
      playgroundEnabled
    }
  }
`;
