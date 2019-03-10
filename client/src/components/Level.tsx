import * as React from 'react';

export const Level = ({ className = '', ...delegated }) => (
  <div className={`level ${className}`} {...delegated} />
);

export const LevelLeft = ({ className = '', ...delegated }) => (
  <div className={`level-left ${className}`} {...delegated} />
);

export const LevelRight = ({ className = '', ...delegated }) => (
  <div className={`level-right ${className}`} {...delegated} />
);

export const LevelItem = ({ className = '', ...delegated }) => (
  <div className={`level-item ${className}`} {...delegated} />
);
