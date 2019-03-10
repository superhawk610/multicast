import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { useInput } from '../hooks/useInput';
import { useBooleanState } from '../hooks/useBooleanState';

import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

import { THEMES } from '../constants';
import { CONFIGURATION } from '../graphql/queries';

const ConfigurationForm = () => {
  const [home, onChangeHome] = useInput('');
  const [port, onChangePort] = useInput('0');
  const [scanningFrequency, onChangeScanningFrequency] = useInput('0');
  const [apiKey, onChangeApiKey] = useInput('');
  const [playgroundEnabled, togglePlayground] = useBooleanState();
  const [sandbox, setSandbox] = React.useState(false);

  const { data, error, loading } = useQuery(CONFIGURATION);

  React.useEffect(() => {}, [data]);

  return (
    <>
      <Input
        disabled
        label="Sandbox"
        defaultValue={sandbox ? 'Enabled' : 'Disabled'}
      />
      <Input
        name="home"
        label="Data Directory"
        value={home}
        onChange={onChangeHome}
      />
      <Input
        type="number"
        name="port"
        label="Port"
        value={port}
        onChange={onChangePort}
      />
      <Input
        type="number"
        name="scanningFrequency"
        label="Scanning Frequency"
        value={scanningFrequency}
        onChange={onChangeScanningFrequency}
      />
      <Input
        name="apiKey"
        label="API Management Key"
        value={apiKey}
        onChange={onChangeApiKey}
      />
      <Select
        name="playgroundEnabled"
        label="GraphQL Playground"
        value={String(playgroundEnabled)}
        options={[
          { name: 'Enabled', value: 'true' },
          { name: 'Disabled', value: 'false' },
        ]}
        onChange={togglePlayground}
      />
      <Button text="Save Changes" theme={THEMES.success} onClick={() => {}} />
    </>
  );
};

export { ConfigurationForm };
