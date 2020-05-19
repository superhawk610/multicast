import gql from 'graphql-tag';
import { Channel, TakeoverStatus } from '../types';

export const SUB_DEVICES = gql`
  subscription {
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
      }
    }
  }
`;

export const SUB_UPDATES = gql`
  subscription Updates($device: ID) {
    updates(device: $device) {
      channel {
        id
        name
        layout
        duration
        urls
      }
      takeover {
        active
        channel {
          id
          name
          layout
          duration
          urls
        }
      }
    }
  }
`;

export interface SUB_UPDATES_Data {
  updates: {
    channel: Channel;
    takeover: TakeoverStatus;
  };
}

export interface SUB_UPDATES_Variables {
  device: number;
}

export const SUB_ALERTS = gql`
  subscription {
    alerts {
      title
      body
      theme
      devices
    }
  }
`;

export const SUB_TAKEOVER = gql`
  subscription {
    takeover {
      active
      channel {
        id
        name
      }
    }
  }
`;
