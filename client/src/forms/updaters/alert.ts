import { ApplicationContext } from '../../AppProvider';
import { MutationUpdaterFn } from 'apollo-client';
import { THEMES } from '../../constants';

export const updateCacheAfterCreate = ({ showMessage }: ApplicationContext): MutationUpdaterFn => (
  cache,
  { errors },
) => {
  if (errors) {
    showMessage({ theme: THEMES.danger, body: 'Something went wrong (check console for details)' });
    console.error(errors);
  } else {
    showMessage({ theme: THEMES.success, body: 'Alert created!' });
  }
};
