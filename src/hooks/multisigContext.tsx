import { useContext } from 'react';
import { MultisigContext } from '../service/multisig-provider';

export const useMultisigContext = () => useContext(MultisigContext);
