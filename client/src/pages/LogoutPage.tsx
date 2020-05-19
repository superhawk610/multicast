import * as React from 'react';
import { AUTH_TOKEN, COLORS } from '../constants';
import { Redirect } from 'react-router';
import styled from 'styled-components';

const LogoutPage = () => {
  const [loggedOut, setLoggedOut] = React.useState(false);

  React.useEffect(() => {
    localStorage.removeItem(AUTH_TOKEN);
    setTimeout(() => setLoggedOut(true), 1500);
  }, []);

  if (loggedOut) return <Redirect to="/login" />;

  return <Container>Logging out...</Container>;
};

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, ${COLORS.greyDarker}, ${COLORS.greyDark});
  color: ${COLORS.greyDarker};
  font-size: 38px;
  font-weight: 700;
  text-transform: uppercase;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export { LogoutPage };
