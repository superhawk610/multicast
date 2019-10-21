import { MutationUpdaterFn } from 'apollo-client';
import { ApplicationContext } from '../../AppProvider';
import { THEMES } from '../../constants';

export const updateCacheAfterUpdate = ({ showMessage }: ApplicationContext): MutationUpdaterFn => (
  cache,
  { errors },
) => {
  if (errors) {
    showMessage({ theme: THEMES.danger, body: 'Something went wrong (check console for details)' });
    console.error(errors);
  } else {
    showMessage({ theme: THEMES.success, body: 'Device updated!' });
  }
};

export const updateCacheAfterRegister = ({
  showMessage,
}: ApplicationContext): MutationUpdaterFn => (cache, { errors }) => {
  if (errors) {
    showMessage({ theme: THEMES.danger, body: 'Something went wrong (check console for details)' });
    console.error(errors);
  } else {
    showMessage({ theme: THEMES.success, body: 'Device registered!' });
  }
};

export const updateCacheAfterUnregister = ({
  showMessage,
}: ApplicationContext): MutationUpdaterFn => (cache, { errors }) => {
  if (errors) {
    showMessage({ theme: THEMES.danger, body: 'Something went wrong (check console for details)' });
    console.error(errors);
  } else {
    showMessage({ theme: THEMES.info, body: 'Device unregistered.' });
  }
};

export const updateCacheAfterConnect = ({ showMessage }: ApplicationContext): MutationUpdaterFn => (
  cache,
  { errors },
) => {
  if (errors) {
    showMessage({ theme: THEMES.danger, body: 'Something went wrong (check console for details)' });
    console.error(errors);
  } else {
    showMessage({ theme: THEMES.info, body: 'Connection request sent to device.' });
  }
};
