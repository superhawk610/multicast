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
