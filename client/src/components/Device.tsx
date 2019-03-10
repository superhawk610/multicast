import * as React from 'react';
import styled from 'styled-components';
import { colorForStatus } from '../utils';

import { Box } from './Box';
import { Well } from './Well';
import { Level, LevelLeft, LevelRight, LevelItem } from './Level';
import { IconButton } from './IconButton';
import { StatusLight } from './StatusLight';

import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import { COLORS } from '../constants';
import { useBooleanState } from '../hooks/useBooleanState';
import { DeviceStatus } from '../types';

interface Props {
  id: number;
  address: string;
  nickname: string;
  model: string;
  status: DeviceStatus;
}

export const Device = ({ id, address, nickname, model, status }: Props) => {
  const [active, toggleDetails] = useBooleanState();

  return (
    <>
      <Box color={colorForStatus(status)} onClick={toggleDetails}>
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
              <StatusLight status={status} />
            </LevelItem>
            <LevelItem>
              <DimText>{model}</DimText>
            </LevelItem>
            <LevelItem>
              <IconButton icon={chevronDown} />
            </LevelItem>
          </LevelRight>
        </Level>
      </Box>
      {active && <DetailWell>edit device form</DetailWell>}
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
