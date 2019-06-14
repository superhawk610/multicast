import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Heading, Heading2 } from './Heading';

import Icon from 'react-icons-kit';
import { chevronLeft } from 'react-icons-kit/feather/chevronLeft';

import { RouteConfiguration } from '../routes';
import { PixelShifter } from './PixelShifter';
import { COLORS } from '../constants';

interface Props {
  heading?: string;
  subheading?: string;
  parent?: RouteConfiguration;
  children: React.ReactNode;
}

const Page = ({ heading, subheading, parent, children, ...delegated }: Props) => (
  <Container {...delegated}>
    {heading && <Heading>{heading}</Heading>}
    {subheading && <Heading2>{subheading}</Heading2>}
    {parent && (
      <Link to={parent.path} style={{ display: 'block', margin: '-15px 0 15px' }}>
        <PixelShifter up={2}>
          <Icon icon={chevronLeft} />
        </PixelShifter>{' '}
        Back to {parent.name}
      </Link>
    )}
    {children}
  </Container>
);

const Container = styled.div`
  padding: 25px;
  padding-left: 275px;
  background: ${COLORS.white};
`;

export { Page };
