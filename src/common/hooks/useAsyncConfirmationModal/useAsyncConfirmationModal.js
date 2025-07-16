import {
  useCallback,
  useRef,
} from 'react';

import { useModalToggle } from '@folio/stripes-acq-components';

export const useAsyncConfirmationModal = () => {
  const promiseRef = useRef({ resolve: Promise.resolve, reject: Promise.reject });
  const [isModalOpen, toggleModal] = useModalToggle();

  const init = useCallback(() => (
    new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
      toggleModal();
    }).finally(() => toggleModal())
  ), [toggleModal]);

  const confirm = useCallback((data) => {
    promiseRef.current.resolve(data);
  }, []);

  const cancel = useCallback((data) => {
    promiseRef.current.reject(data);
  }, []);

  return {
    cancel,
    confirm,
    init,
    isModalOpen,
  };
};
