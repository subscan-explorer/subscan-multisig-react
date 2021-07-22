import { useContext } from 'react';
import { ApiContext, ApiCtx } from '../providers';

export const useApi = () => useContext(ApiContext) as Exclude<ApiCtx, null>;
