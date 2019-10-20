import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useBooleanState } from '../hooks/useBooleanState';

import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

import { THEMES } from '../constants';
import { CONFIGURATION } from '../graphql/queries';
import { UPDATE_CONFIGURATION } from '../graphql/mutations';
import { useStatus } from '../hooks/useStatus';

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
        home,
        port: parseInt(port),
        scanningFrequency: parseInt(scanningFrequency),
        playgroundEnabled,
      },
    },
  });

  React.useEffect(() => {
    if (data) {
      setHome(data.configuration.home);
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
      <Input disabled label="Sandbox" value={status.sandbox ? 'Enabled' : 'Disabled'} />
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
      <Button text="Save Changes" theme={THEMES.success} onClick={updateConfiguration} />
    </>
  );
};

export { ConfigurationForm };
