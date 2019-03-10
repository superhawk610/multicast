import * as React from 'react';
import styled from 'styled-components';
import { colorForStatus } from '../utils';

import { Box } from './Box';
import { Well } from './Well';
import { Level, LevelLeft, LevelRight, LevelItem } from './Level';
import { IconButton } from './IconButton';
import { StatusLight } from './StatusLight';
import { DeviceForm } from '../forms/DeviceForm';

import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import { COLORS } from '../constants';
import { useBooleanState } from '../hooks/useBooleanState';
import { Device as Props } from '../types';

const Device = (device: Props) => {
  const { id, address, nickname, model, supported, status } = device;
  const [active, toggleDetails] = useBooleanState();

  return (
    <>
      <Box
        color={supported ? colorForStatus(status) : COLORS.greyLight}
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
                <BoldText>{nickname}</BoldText>
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
