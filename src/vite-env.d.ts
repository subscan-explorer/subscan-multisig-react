/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST_TYPE?: string;
  readonly VITE_MULTISIG_MEMBER_MNEMONICS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
