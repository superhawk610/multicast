import * as React from 'react';
import { colorForStatus } from '../utils';
import styled from 'styled-components';

import { Box } from './Box';
import { Well } from './Well';
import { Level, LevelLeft, LevelRight, LevelItem } from './Level';
import { IconButton } from './IconButton';
import { StatusLight } from './StatusLight';
import { DeviceForm } from '../forms/DeviceForm';

import Icon from 'react-icons-kit';
import { checkCircle } from 'react-icons-kit/feather/checkCircle';
import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import { COLORS } from '../constants';
import { useBooleanState } from '../hooks/useBooleanState';
import { Device as Props } from '../types';

const Device = (device: Props) => {
  const { registered, address, nickname, model, supported, status } = device;
  const [active, toggleDetails] = useBooleanState();

  const boxColor = () => {
    switch (true) {
      case !supported:
        return COLORS.greyLight;
      case !registered:
        return COLORS.cyan;
      default:
        return colorForStatus(status);
    }
  };

  const renderBadge = () => {
    switch (true) {
      case !supported:
        return null;
      case !registered:
        return <Badge>UNREGISTERED</Badge>;
      default:
        return (
          <span title="registered">
            <Icon
              style={{
                transform: 'translateY(-2px)',
                marginLeft: '0.5rem',
                color: COLORS.green,
              }}
              icon={checkCircle}
            />
          </span>
        );
    }
  };

  return (
    <>
      <Box
        color={boxColor()}
        onClick={supported ? toggleDetails : undefined}
        style={supported ? {} : { opacity: 0.5 }}
      >
        <Level>
          <LevelLeft>
            <LevelItem>
              <div className="has-text-centered" style={{ width: '125px' }}>
                <SmallText>IP ADDRESS</SmallText>
                <BoldText>{address}</BoldText>
              </div>
            </LevelItem>
            <LevelItem>
              <div>
                <SmallText>NICKNAME</SmallText>
                <BoldText>
                  {nickname}
                  {renderBadge()}
                </BoldText>
              </div>
            </LevelItem>
          </LevelLeft>
          <LevelRight>
            <LevelItem>
              <DimText>{model}</DimText>
            </LevelItem>
            <LevelItem>
              <StatusLight status={status} />
            </LevelItem>
            {supported && (
              <LevelItem>
                <IconButton icon={chevronDown} />
              </LevelItem>
            )}
          </LevelRight>
        </Level>
      </Box>
      {active && (
        <DetailWell>
          <DeviceForm device={device} />
        </DetailWell>
      )}
    </>
  );
};

const Badge = styled.div`
  display: inline-block;
  vertical-align: top;
  font-size: 0.5em;
  font-weight: 700;
  margin: 0.3rem 0 0 0.75rem;
  padding: 3px 10px 2px;
  border-radius: 1000px;
  background: ${COLORS.greyLighter};
  color: ${COLORS.white};
`;

const SmallText = styled.div`
  font-size: 0.8em;
  color: ${COLORS.grey};
`;

const BoldText = styled.div`
  font-size: 1.2em;
  font-weight: 700;
`;

const DimText = styled.div`
  color: ${COLORS.greyLight};
`;

const DetailWell = styled(Well)`
  margin: -25px 5px 25px;
  padding: 25px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export { Device };
