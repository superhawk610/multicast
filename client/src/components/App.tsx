import * as React from 'react';
import { Switch, Route, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Sidebar } from './Sidebar';
import { SandboxWarning } from './SandboxWarning';
import { ConfirmDialog } from './ConfirmDialog';
import { Notifications } from './Notifications';

import { LandingPage } from '../pages/LandingPage';
import { NotFound } from '../pages/NotFound';

import routes from '../routes';

import { MAX_WIDTH, COLORS } from '../constants';

const App = withRouter(({ location }: RouteComponentProps) => {
  const { pathname } = location;
  const hideUI = pathname.match(/^\/landing/);

  return (
    <Background>
      {!hideUI && (
        <>
          <Sidebar />
          <SandboxWarning />
          <ConfirmDialog />
          <Notifications />
        </>
      )}
      <Constraint>
        <Switch>
          <Route path="/landing" component={LandingPage} />
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
    </Background>
  );
});

const Background = styled.div`
  background: ${COLORS.white};
`;

const Constraint = styled.div`
  max-width: ${MAX_WIDTH}px;
`;

export { App };
