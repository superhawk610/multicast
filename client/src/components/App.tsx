import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { Sidebar } from './Sidebar';
import { SandboxWarning } from './SandboxWarning';
import { ConfirmDialog } from './ConfirmDialog';

import { NotFound } from '../pages/NotFound';

import routes from '../routes';

export const App = () => (
  <>
    <Sidebar />
    <SandboxWarning />
    <ConfirmDialog />
    <Constraint>
      <Switch>
        {Object.keys(routes).map((key, index) => {
          const route = routes[key];
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          );
        })}
        <Route exact path="/">
          <Redirect to="/devices" />
        </Route>
        <Route path="/404" component={NotFound} />
        <Redirect to="/404" />
      </Switch>
    </Constraint>
  </>
);

const Constraint = styled.div`
  max-width: 1250px;
`;
