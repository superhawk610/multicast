import * as React from 'react';
import {
  Link as LinkComponent,
  matchPath,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import styled from 'styled-components';

import logo from '../images/multicast.png';

import { COLORS } from '../constants';

import routes from '../routes';

export const Sidebar = withRouter(({ location }: RouteComponentProps) => (
  <Container>
    <Header>
      <HeadingImage src={logo} />
      <Heading>Multicast Web</Heading>
    </Header>
    {Object.keys(routes)
      .filter(key => {
        const route = routes[key];
        return route.displayInSidebar;
      })
      .map((key, index) => {
        const route = routes[key];
        const isActive = !!matchPath(location.pathname, route.path);

        return (
          <Link active={isActive ? 1 : 0} key={index} to={route.path}>
            {key}
          </Link>
        );
      })}
  </Container>
));

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  padding: 35px;
  background: ${COLORS.white3};
`;

const Header = styled.div`
  margin: 10px 0 25px;
`;

const HeadingImage = styled.img`
  display: block;
  width: 50px;
  margin-bottom: 5px;
`;

const Heading = styled.div`
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${COLORS.black3};
`;

const Link = styled(LinkComponent)<{ active: number }>`
  display: block;
  font-size: 1.2em;
  font-weight: 700;
  color: ${props => (props.active ? COLORS.cyan : COLORS.blue)};
  position: relative;

  &:hover {
    color: ${props => (props.active ? COLORS.cyan : COLORS.blue)};
  }

  ${props =>
    props.active &&
    `
    &::after {
      content: '•';
      display: block;
      position: absolute;
      top: 0;
      left: -15px;
      font-size: 0.8em;
    }
  `};
`;
