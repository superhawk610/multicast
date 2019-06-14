import * as React from 'react';

interface Props {
  sneaky?: boolean;
  src: string;
}

const NinjaFrame = ({ sneaky, src, ...props }: Props) => {
  const source = sneaky ? `http://localhost:4000/__proxy?url=${encodeURIComponent(src)}` : src;

  return <iframe src={source} {...props} />;
};

export { NinjaFrame };
