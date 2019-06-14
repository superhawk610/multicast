import * as React from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { useInput } from '../hooks/useInput';
import { useBooleanState } from '../hooks/useBooleanState';

import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

import { THEMES } from '../constants';
import { CONFIGURATION } from '../graphql/queries';
import { UPDATE_CONFIGURATION } from '../graphql/mutations';
import { useStatus } from '../hooks/useStatus';

const ConfigurationForm = () => {
  const [home, onChangeHome, setHome] = useInput('');
  const [port, onChangePort, setPort] = useInput('0');
  const [scanningFrequency, onChangeScanningFrequency, setScanningFrequency] = useInput('0');
  const [apiKey, onChangeApiKey] = useInput('');
  const [playgroundEnabled, togglePlayground, setPlaygroundEnabled] = useBooleanState();

  const { data, loading } = useQuery(CONFIGURATION);
  const { status } = useStatus();

  const updateConfiguration = useMutation(UPDATE_CONFIGURATION, {
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
    if (data.configuration) {
      console.table(data);
      setHome(data.configuration.home);
      setPort(data.configuration.port);
      setScanningFrequency(data.configuration.scanningFrequency);
      setPlaygroundEnabled(data.configuration.playgroundEnabled);
    }
  }, [data]);

  return loading ? (
    'Loading...'
  ) : (
    <>
      <Input disabled label="Sandbox" value={status.sandbox ? 'Enabled' : 'Disabled'} />
      <Input name="home" label="Data Directory" value={home || ''} onChange={onChangeHome} />
      <Input type="number" name="port" label="Port" value={port || ''} onChange={onChangePort} />
      <Input
        type="number"
        name="scanningFrequency"
        label="Scanning Frequency"
        value={scanningFrequency || ''}
        onChange={onChangeScanningFrequency}
      />
      <Input
        name="apiKey"
        label="API Management Key"
        placeholder="<hidden> (set to overwrite)"
        value={apiKey || ''}
        onChange={onChangeApiKey}
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
