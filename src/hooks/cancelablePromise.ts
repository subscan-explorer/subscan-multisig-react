import { useCallback } from 'react';
import { useMountedState } from './mountedState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCancelablePromise = <T = any>() => {
  const isMounted = useMountedState();

  return useCallback(
    (promise: Promise<T>, onCancel?: () => void) =>
      new Promise((resolve, reject) => {
        promise
          .then((result: T) => {
            if (isMounted()) {
              resolve(result);
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((error: any) => {
            if (isMounted()) {
              reject(error);
            }
          })
          .finally(() => {
            if (!isMounted() && onCancel) {
              onCancel();
            }
          });
      }),
    [isMounted]
  );
};
