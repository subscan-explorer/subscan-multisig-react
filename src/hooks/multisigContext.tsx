import { useContext } from 'react';
import { MultisigContext } from '../providers/multisig-provider';
import { CrowdloanContext } from '../providers/crowdloan-provider';

export const useMultisigContext = () => useContext(MultisigContext);
export const useCrowdloanContext = () => useContext(CrowdloanContext);
