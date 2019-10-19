import * as React from 'react';

import { Button, ButtonTheme } from './Button';

import { THEMES } from '../constants';

export interface Props {
  heading: string;
  accent?: any;
  active: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitText?: string;
  submitButtonTheme?: ButtonTheme;
  children?: any;
}

const Modal = ({
  heading,
  accent,
  active,
  onClose,
  onSubmit,
  submitText = 'Save',
  submitButtonTheme = THEMES.success,
  children,
}: Props) => (
  <div className={`modal ${active ? 'is-active' : ''}`}>
    <div className="modal-background" onClick={onClose} />
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{heading}</p>
        {accent && <div style={{ marginRight: '10px' }}>{accent}</div>}
        <button className="delete" aria-label="close" onClick={onClose} />
      </header>
      <section className="modal-card-body">{children}</section>
      <footer className="modal-card-foot">
        <Button text={submitText} theme={submitButtonTheme} onClick={onSubmit} />
        <Button text="Cancel" theme={THEMES.light} onClick={onClose} />
      </footer>
    </div>
  </div>
);

export { Modal };
