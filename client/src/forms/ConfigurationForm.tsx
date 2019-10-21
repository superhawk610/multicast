import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useBooleanState } from '../hooks/useBooleanState';
import styled from 'styled-components';

import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

import { THEMES, COLORS } from '../constants';
import { CONFIGURATION } from '../graphql/queries';
import { UPDATE_CONFIGURATION } from '../graphql/mutations';
import { useStatus } from '../hooks/useStatus';
import { Spacer } from '../components/Spacer';

function parseHome(path: string) {
  if (path[0] === '~' && path[1] === '/') {
    return path.substr(2);
  } else {
    return path;
  }
}

function displayHome(path: string) {
  switch (true) {
    case path[0] === '~' && path[1] === '/':
    case path[0] === '/':
      return path;
    default:
      return `~/${path}`;
  }
}

const ConfigurationForm = () => {
  const [home, setHome] = React.useState('');
  const [port, setPort] = React.useState('0');
  const [scanningFrequency, setScanningFrequency] = React.useState('0');
  const [apiKey, setApiKey] = React.useState('');
  const [playgroundEnabled, togglePlayground, setPlaygroundEnabled] = useBooleanState();

  const { data, loading } = useQuery(CONFIGURATION);
  const { status } = useStatus();

  const [updateConfiguration] = useMutation(UPDATE_CONFIGURATION, {
    variables: {
      changes: {
        home: parseHome(home),
        port: parseInt(port),
        scanningFrequency: parseInt(scanningFrequency),
        playgroundEnabled,
      },
    },
  });

  React.useEffect(() => {
    if (data) {
      setHome(displayHome(data.configuration.home));
      setPort(data.configuration.port);
      setScanningFrequency(data.configuration.scanningFrequency);
      setPlaygroundEnabled(data.configuration.playgroundEnabled);
    }
  }, [data]);

  return loading ? (
    // FIXME: this should just return 'Loading...' once
    // https://github.com/microsoft/TypeScript/issues/21699 is resolved
    <>Loading...</>
  ) : (
    <>
      <Input
        disabled
        label="Sandbox"
        value={`${status.sandbox ? 'Enabled' : 'Disabled'} (can only be modified at server launch)`}
      />
      <Input name="home" label="Data Directory" value={home || ''} onChange={setHome} />
      <Input type="number" name="port" label="Port" value={port || ''} onChange={setPort} />
      <Input
        type="number"
        name="scanningFrequency"
        label="Scanning Frequency (ms)"
        value={scanningFrequency || ''}
        onChange={setScanningFrequency}
      />
      <Input
        name="apiKey"
        label="API Management Key"
        placeholder="<hidden> (set to overwrite)"
        value={apiKey || ''}
        onChange={setApiKey}
      />
      <Select
        name="playgroundEnabled"
        label="GraphQL Playground"
        value={String(playgroundEnabled)}
        options={[{ name: 'Enabled', value: 'true' }, { name: 'Disabled', value: 'false' }]}
        onChange={togglePlayground}
      />
      <Spacer />
      <Button text="Save Changes" theme={THEMES.success} onClick={updateConfiguration} />
      <Info>
        Saving will restart the server, clearing any active alerts and ending any active takeovers.
      </Info>
    </>
  );
};

const Info = styled.p`
  color: ${COLORS.greyLight};
  margin-top: 1rem;
`;

export { ConfigurationForm };
