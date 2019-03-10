import * as React from 'react';

interface Props {
  onSubmit: () => void;
  children?: React.ReactNode;
}

const Form = ({ onSubmit, ...delegated }: Props) => {
  const submitHandler = React.useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return <form onSubmit={submitHandler} {...delegated} />;
};

export { Form };
