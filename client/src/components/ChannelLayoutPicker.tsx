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
  compact?: boolean;
}

const SingleLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
  </LayoutPreview>
);

const EvenVerticalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
  </LayoutPreview>
);

const EvenHorizontalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
  </LayoutPreview>
);

const OneTwoVerticalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="1fr 2fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
  </LayoutPreview>
);

const OneTwoHorizontalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 2fr"
    templateRows="1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
  </LayoutPreview>
);

const TwoOneVerticalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr"
    templateRows="2fr 1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
  </LayoutPreview>
);

const TwoOneHorizontalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="2fr 1fr"
    templateRows="1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
  </LayoutPreview>
);

const OneOneTwoVerticalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0} startColumn={1} endColumn={3} startRow={2} endRow={2}>
      {!compact && 'URL '}3
    </LayoutSection>
  </LayoutPreview>
);

const OneOneTwoHorizontalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}1</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0} startColumn={1} endColumn={2} startRow={2} endRow={2}>
      {!compact && 'URL '}2
    </LayoutSection>
    <LayoutSection compact={compact ? 1 : 0} startColumn={2} endColumn={2} startRow={1} endRow={3}>
      {!compact && 'URL '}3
    </LayoutSection>
  </LayoutPreview>
);

const TwoOneOneVerticalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection compact={compact ? 1 : 0} startColumn={1} endColumn={3} startRow={1} endRow={1}>
      {!compact && 'URL '}1
    </LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}3</LayoutSection>
  </LayoutPreview>
);

const TwoOneOneHorizontalSplitLayout = ({ onClick, clickIndicator, compact }: LayoutProps) => (
  <LayoutPreview
    compact={compact ? 1 : 0}
    clickIndicator={clickIndicator ? 1 : 0}
    onClick={onClick}
    templateColumns="1fr 1fr"
    templateRows="1fr 1fr"
  >
    <LayoutSection compact={compact ? 1 : 0} startColumn={1} endColumn={1} startRow={1} endRow={3}>
      {!compact && 'URL '}1
    </LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}2</LayoutSection>
    <LayoutSection compact={compact ? 1 : 0}>{!compact && 'URL '}3</LayoutSection>
  </LayoutPreview>
);

interface Props {
  layout: ChannelLayout;
  onChange: (layout: ChannelLayout, urlSlotCount: number) => void;
  children?: any;
}

interface ChannelLayoutConfig {
  Component: React.SFC<any>;
  value: ChannelLayout;
  urlSlotCount: number;
}

interface ChannelLayoutMapping {
  [layout: string]: ChannelLayoutConfig;
}

export const channelLayoutMap: ChannelLayoutMapping = {
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

const rows = chunk(Object.values(channelLayoutMap), 3);

const ChannelLayoutPicker = ({ layout, onChange, children }: Props) => {
  const [active, togglePicker] = useBooleanState();

  const ActiveLayoutComponent = channelLayoutMap[layout].Component;

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
  compact?: number;
  startColumn?: number;
  endColumn?: number;
  startRow?: number;
  endRow?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => (props.compact ? 1 : 2)}px solid ${COLORS.grey};
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
  compact?: number;
  clickIndicator?: number;
  templateColumns: string;
  templateRows: string;
}>`
  display: grid;
  grid-template-columns: ${props => props.templateColumns};
  grid-template-rows: ${props => props.templateRows};
  border: ${props => (props.compact ? 2 : 4)}px solid ${COLORS.grey};
  border-radius: 4px;
  height: ${props => (props.compact ? 44 : 200)}px;
  position: relative;

  ${props =>
    props.compact
      ? `
        cursor: default;
        font-size: 10px;
      `
      : `
        &:hover {
          cursor: pointer;
          box-shadow: 0 0 5px ${COLORS.green};
          border-color: ${COLORS.green};

          > ${LayoutSection} {
            border-color: ${COLORS.green};
            background: ${COLORS.greenTint};
            color: ${COLORS.green};
          }

          ${props.clickIndicator &&
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
        }`}
`;

export { ChannelLayoutPicker };
