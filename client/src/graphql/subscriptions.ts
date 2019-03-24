import gql from 'graphql-tag';

export const SUB_DEVICES = gql`
  subscription {
    devices {
      id
      identifier
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
