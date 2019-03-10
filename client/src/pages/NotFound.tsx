import * as React from 'react';
import { Link } from 'react-router-dom';

import { Page } from '../components/Page';
import { CornerCat } from '../components/CornerCat';

const NotFound = () => (
  <Page heading="Oops!">
    <p>That page doesn't seem to exist.</p>
    <Link to="/">Go Home</Link>
    <CornerCat in />
  </Page>
);

export { NotFound };
