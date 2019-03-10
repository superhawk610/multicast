import * as React from 'react';

import { Page } from '../components/Page';
import { ConfigurationForm } from '../forms/ConfigurationForm';

const Configuration = () => {
  return (
    <Page heading="Configuration" subheading="Application Settings">
      <ConfigurationForm />
    </Page>
  );
};

export { Configuration };
