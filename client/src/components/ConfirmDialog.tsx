import * as React from 'react';
import styled from 'styled-components';

import { AppContext } from '../AppContext';

import { Box } from './Box';
import { Button } from './Button';

import { THEMES } from '../constants';

export const ConfirmDialog = () => {
  const { dialog, hideDialog } = React.useContext(AppContext);

  const onCancel = React.useCallback(() => hideDialog(false), []);
  const onConfirm = React.useCallback(() => hideDialog(true), []);

  return (
    <div className={`modal ${dialog.active ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onCancel} />
      <div className="modal-content">
        <Box>
          <DialogHeading>{dialog.title}</DialogHeading>
          <DialogMessage>{dialog.body}</DialogMessage>
          <Button
            adjacent
            onClick={onConfirm}
            text="Confirm"
            theme={THEMES.danger}
          />
          <Button onClick={onCancel} text="Cancel" theme={THEMES.light} />
        </Box>
      </div>
      <button className="modal-close" onClick={onCancel} />
    </div>
  );
};

const DialogHeading = styled.div`
  font-size: 1.2em;
`;

const DialogMessage = styled.p`
  padding: 5px 0 20px;
`;
