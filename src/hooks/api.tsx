import { useContext } from 'react';
import { ApiContext, ApiCtx } from '../service';

export const useApi = () => useContext(ApiContext) as Exclude<ApiCtx, null>;
