import { useQuery } from 'react-apollo-hooks';

import { STATUS } from '../graphql/queries';

export function useStatus() {
  const { error, loading, data } = useQuery(STATUS);
  const { status = { sandbox: false } } = data || {
    status: { sandbox: false },
  };
  return { error, loading, status };
}
