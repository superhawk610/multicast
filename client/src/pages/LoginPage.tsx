import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { basePath } from '../utils';
import styled from 'styled-components';

import { AppContext } from '../AppProvider';

import logo from '../assets/watermark.png';
import { checkCircle } from 'react-icons-kit/feather/checkCircle';

import { Input } from '../components/Input';
import { Well } from '../components/Well';
import { Form } from '../components/Form';
import { Button } from '../components/Button';
import { Row, Column } from '../components/Grid';

import { AUTH_TOKEN, COLORS, THEMES } from '../constants';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../graphql/mutations';

const LoginPage = () => {
  const [token, setToken] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { reloadClient } = React.useContext(AppContext);

  const [login, loginMutation] = useMutation(LOGIN, { variables: { token } });

  React.useEffect(() => {
    const stored = localStorage.getItem(AUTH_TOKEN);

    if (stored) {
      setToken(stored);
      login();
    }
  }, []);

  React.useEffect(() => {
    if (loginMutation.error || (loginMutation.data && !loginMutation.data.validateLogin)) {
      setError('Invalid token');
    } else if (loginMutation.data && loginMutation.data.validateLogin) {
      localStorage.setItem(AUTH_TOKEN, token);
      reloadClient();
      setTimeout(() => setLoggedIn(true), 1000);
    }
  }, [loginMutation.data, loginMutation.error, token]);

  React.useEffect(() => {
    setError(null);
  }, [token]);

  const onSubmit = () => {
    setError(null);
    login();
  };

  if (loggedIn) return <Redirect to="/devices" />;

  return (
    <Container>
      <Logo src={basePath(logo)} />
      <Well>
        <Form onSubmit={onSubmit}>
          <Row>
            <Column width={9}>
              <Input
                type="password"
                value={token}
                error={error}
                onChange={setToken}
                disabled={loginMutation.loading}
                leftIcon={checkCircle}
                placeholder="API Key"
              />
            </Column>
            <Column width={3}>
              <Button
                block
                submit
                text="Go"
                theme={THEMES.success}
                disabled={!token.trim()}
                loading={loginMutation.loading}
              />
            </Column>
          </Row>
        </Form>
      </Well>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, ${COLORS.greyDarker}, ${COLORS.greyDark});

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  opacity: 0.3;
  width: 100px;
  margin-bottom: 3rem;
`;

export { LoginPage };
