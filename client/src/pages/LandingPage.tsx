import * as React from 'react';
import { getInjected } from '../getInjected';
import styled from 'styled-components';

import logo from '../images/watermark.png';

import { Spacer } from '../components/Spacer';

import { COLORS } from '../constants';
import { basePath } from '../utils';

const host = getInjected('host');
const name = getInjected('name');
const upstream = getInjected('upstream');

const LandingPage = () => (
  <Page>
    <Container>
      <Header>
        Host <strong>{host}</strong>
      </Header>
      <Header>
        Device <strong>{name}</strong>
      </Header>
      <Spacer />
      <p>
        To get started, head over to <Link>http://{upstream}/web</Link>
      </p>
    </Container>
    <Logo src={basePath(logo)} />
  </Page>
);

const Page = styled.div`
  background: ${COLORS.green};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Container = styled.div`
  font-size: 24px;
  color: ${COLORS.black};
  max-width: 600px;
  width: 100%;
`;

const Header = styled.h1`
  font-size: 28px;
  color: ${COLORS.greenTintDark};

  > strong {
    color: ${COLORS.black};
  }
`;

const Link = styled.span`
  color: ${COLORS.white};
  padding-bottom: 2px;
  border-bottom: 2px solid ${COLORS.white};
`;

const Logo = styled.img`
  position: absolute;
  bottom: 25px;
  right: 25px;
  width: 75px;
  opacity: 0.3;
`;

export { LandingPage };
