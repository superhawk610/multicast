import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import useConstant from 'use-constant';
import { getInjected } from '../getInjected';
import { basePath } from '../utils';
import styled from 'styled-components';
import * as qs from 'qs';

import logo from '../assets/watermark.png';

import { Spacer } from '../components/Spacer';
import { Alerts } from '../components/Alerts';

import { COLORS } from '../constants';
import { DEVICE, DEVICE_Data, DEVICE_Variables } from '../graphql/queries';
import { ChannelDisplay } from '../components/ChannelDisplay';

interface Props extends RouteComponentProps {}

const host = getInjected('host', 'HOST');
const name = getInjected('name', 'NAME');
const deviceFromServerInject = getInjected('device', null);
const upstream = getInjected('upstream', 'UPSTREAM');
const env = process.env.NODE_ENV;

const DeviceUninitialized = () => (
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
    <Alerts />
    <Logo src={basePath(logo)} />
  </Page>
);

const LandingPage = ({ location }: Props) => {
  const parsed = useConstant(() => qs.parse(location.search, { ignoreQueryPrefix: true }));
  const device = (parsed.device as string) || deviceFromServerInject;

  const [getDevice, getQuery] = useLazyQuery<DEVICE_Data, DEVICE_Variables>(DEVICE);

  React.useEffect(() => {
    if (device) getDevice({ variables: { id: device } });
  }, []);

  if (getQuery.loading) return null;

  if (getQuery.error) {
    // don't leak error details in production
    const message = env === 'development' ? getQuery.error.message : '';
    return <div>something went wrong! {message}</div>;
  }

  if (!device || !getQuery.data || !getQuery.data.device.channel) return <DeviceUninitialized />;

  return (
    <ChannelDisplay
      channel={getQuery.data.device.channel}
      rotation={getQuery.data.device.rotation}
    />
  );
};

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
  max-width: calc(100% - 3rem);
  width: 600px;
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
