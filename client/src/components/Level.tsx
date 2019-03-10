import * as React from 'react';

const Level = ({ className = '', ...delegated }) => (
  <div className={`level ${className}`} {...delegated} />
);

const LevelLeft = ({ className = '', ...delegated }) => (
  <div className={`level-left ${className}`} {...delegated} />
);

const LevelRight = ({ className = '', ...delegated }) => (
  <div className={`level-right ${className}`} {...delegated} />
);

const LevelItem = ({ className = '', ...delegated }) => (
  <div className={`level-item ${className}`} {...delegated} />
);

export { Level, LevelLeft, LevelRight, LevelItem };
