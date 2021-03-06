// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import type { ModalState } from './types';
import { useToggle } from './useToggle';

export function useModal(defaultIsOpen?: boolean, onOpen?: () => void, onClose?: () => void): ModalState {
  const [isOpen, , setIsOpen] = useToggle(defaultIsOpen || false);
  const _onOpen = useCallback((): void => {
    setIsOpen(true);

    // eslint-disable-next-line
    onOpen && onOpen();
  }, [onOpen, setIsOpen]);
  const _onClose = useCallback((): void => {
    setIsOpen(false);

    // eslint-disable-next-line
    onClose && onClose();
  }, [onClose, setIsOpen]);

  return { isOpen, onClose: _onClose, onOpen: _onOpen };
}
