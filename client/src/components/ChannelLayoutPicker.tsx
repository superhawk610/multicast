import * as React from 'react';
import styled from 'styled-components';
import { chunk } from '../utils';

import { Row, Column } from './Grid';
import { Well } from './Well';

import { COLORS } from '../constants';
import { ChannelLayout } from '../types';
import { useBooleanState } from '../hooks/useBooleanState';

interface LayoutProps {
  onClick: () => void;
  clickIndicator?: boolean;
}

const SingleLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
  </LayoutPreview>
);

const EvenVerticalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
  </LayoutPreview>
);

const EvenHorizontalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
  </LayoutPreview>
);

const OneTwoVerticalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="1fr 2fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
  </LayoutPreview>
);

const OneTwoHorizontalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 2fr"
    templateRows="1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
  </LayoutPreview>
);

const TwoOneVerticalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="2fr 1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
  </LayoutPreview>
);

const TwoOneHorizontalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="2fr 1fr"
    templateRows="1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
  </LayoutPreview>
);

const OneOneTwoVerticalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
    <LayoutSection startColumn={1} endColumn={3} startRow={2} endRow={2}>
      URL 3
    </LayoutSection>
  </LayoutPreview>
);

const OneOneTwoHorizontalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection>URL 1</LayoutSection>
    <LayoutSection startColumn={1} endColumn={2} startRow={2} endRow={2}>
      URL 2
    </LayoutSection>
    <LayoutSection startColumn={2} endColumn={2} startRow={1} endRow={3}>
      URL 3
    </LayoutSection>
  </LayoutPreview>
);

const TwoOneOneVerticalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection startColumn={1} endColumn={3} startRow={1} endRow={1}>
      URL 1
    </LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
    <LayoutSection>URL 3</LayoutSection>
  </LayoutPreview>
);

const TwoOneOneHorizontalSplitLayout = ({ onClick, clickIndicator }: LayoutProps) => (
  <LayoutPreview
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection startColumn={1} endColumn={1} startRow={1} endRow={3}>
      URL 1
    </LayoutSection>
    <LayoutSection>URL 2</LayoutSection>
    <LayoutSection>URL 3</LayoutSection>
  </LayoutPreview>
);

interface Props {
  layout: ChannelLayout;
  onChange: (layout: ChannelLayout, urlSlotCount: number) => void;
  children?: any;
}

interface State {
  active: boolean;
}

interface ChannelLayoutConfig {
  Component: React.SFC<any>;
  value: ChannelLayout;
  urlSlotCount: number;
}

interface ChannelLayoutMapping {
  [layout: string]: ChannelLayoutConfig;
}

const channelLayouts: ChannelLayoutMapping = {
  single: { Component: SingleLayout, value: 'single', urlSlotCount: 1 },
  '1-1-vertical': {
    Component: EvenVerticalSplitLayout,
    value: '1-1-vertical',
    urlSlotCount: 2,
  },
  '1-1-horizontal': {
    Component: EvenHorizontalSplitLayout,
    value: '1-1-horizontal',
    urlSlotCount: 2,
  },
  '1-2-vertical': {
    Component: OneTwoVerticalSplitLayout,
    value: '1-2-vertical',
    urlSlotCount: 2,
  },
  '1-2-horizontal': {
    Component: OneTwoHorizontalSplitLayout,
    value: '1-2-horizontal',
    urlSlotCount: 2,
  },
  '2-1-vertical': {
    Component: TwoOneVerticalSplitLayout,
    value: '2-1-vertical',
    urlSlotCount: 2,
  },
  '2-1-horizontal': {
    Component: TwoOneHorizontalSplitLayout,
    value: '2-1-horizontal',
    urlSlotCount: 2,
  },
  '2-1-1-vertical': {
    Component: OneOneTwoVerticalSplitLayout,
    value: '2-1-1-vertical',
    urlSlotCount: 3,
  },
  '2-1-1-horizontal': {
    Component: OneOneTwoHorizontalSplitLayout,
    value: '2-1-1-horizontal',
    urlSlotCount: 3,
  },
  '1-1-2-vertical': {
    Component: TwoOneOneVerticalSplitLayout,
    value: '1-1-2-vertical',
    urlSlotCount: 3,
  },
  '1-1-2-horizontal': {
    Component: TwoOneOneHorizontalSplitLayout,
    value: '1-1-2-horizontal',
    urlSlotCount: 3,
  },
};

const rows = chunk(Object.values(channelLayouts), 3);

const ChannelLayoutPicker = ({ layout, onChange, children }: Props) => {
  const [active, togglePicker] = useBooleanState();

  const ActiveLayoutComponent = channelLayouts[layout].Component;

  return (
    <>
      <label className="label">Channel Layout</label>
      <Row>
        <Column width={4}>
          <ActiveLayoutComponent clickIndicator onClick={togglePicker} />
        </Column>
        <Column>{children}</Column>
      </Row>
      {active && (
        <Well>
          <label className="label">Select A Layout</label>
          {rows.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map(({ Component, value, urlSlotCount }, layoutIndex) => {
                const onClick = () => {
                  togglePicker();
                  onChange(value, urlSlotCount);
                };

                return (
                  <Column key={layoutIndex} width={4}>
                    <Component onClick={onClick} />
                  </Column>
                );
              })}
            </Row>
          ))}
        </Well>
      )}
    </>
  );
};

const LayoutSection = styled.div<{
  startColumn?: number;
  endColumn?: number;
  startRow?: number;
  endRow?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${COLORS.grey};
  background: ${COLORS.greyTint};
  ${props =>
    props.startColumn &&
    `
    grid-column-start: ${props.startColumn};
    grid-column-end: ${props.endColumn};
    grid-row-start: ${props.startRow};
    grid-row-end: ${props.endRow};
  `};
`;

const LayoutPreview = styled.div<{
  clickIndicator?: number;
  templateColumns: string;
  templateRows: string;
}>`
  display: grid;
  grid-template-columns: ${props => props.templateColumns};
  grid-template-rows: ${props => props.templateRows};
  border: 4px solid ${COLORS.grey};
  border-radius: 4px;
  height: 200px;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 0 5px ${COLORS.green};
    border-color: ${COLORS.green};

    > ${LayoutSection} {
      border-color: ${COLORS.green};
      background: ${COLORS.greenTint};
      color: ${COLORS.green};
    }

    ${props =>
      props.clickIndicator &&
      `
      ::after {
        content: '';
        display: block;
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px;
        border-color: transparent ${COLORS.green} ${COLORS.green} transparent;
      }
      `};
  }
`;

export { ChannelLayoutPicker };
