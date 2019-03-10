import gql from 'graphql-tag';

export const SUB_DEVICES = gql`
  subscription {
    devices {
      id
      identifier
      nickname
      address
      model
      rotation
      status
      channel {
        id
        name
      }
    }
  }
`;
