import { useContext } from 'react';
import { MultisigContext } from '../providers/multisig-provider';

export const useMultisigContext = () => useContext(MultisigContext);
