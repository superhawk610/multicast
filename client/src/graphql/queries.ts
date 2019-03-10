import { gql } from 'apollo-boost';

export const DEVICES = gql`
  {
    devices {
      id
      identifier
      nickname
      rotation
      online
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

export const CHANNELS = gql`
  {
    channels {
      id
      name
      layout
      duration
      urls
      devices {
        id
      }
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
      devices {
        id
      }
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
