declare const _default: {
  'Crust Maxwell': {
    AccountInfo: string;
    Address: string;
    AddressInfo: string;
    LookupSource: string;
    EraBenefits: {
      total_benefits: string;
      total_funds: string;
      used_benefits: string;
      active_era: string;
    };
    FeeReductionBenefit: {
      funds: string;
      total_fee_reduction_count: string;
      used_fee_reduction_quota: string;
      used_fee_reduction_count: string;
      refreshed_at: string;
    };
    CsmBalance: string;
    CsmBalanceOf: string;
    ETHAddress: string;
    EthereumTxHash: string;
    CSMLedger: {
      total: string;
      active: string;
      unlocking: string;
    };
    CSMUnlockChunk: {
      value: string;
      bn: string;
    };
    FileInfo: {
      file_size: string;
      expired_on: string;
      calculated_at: string;
      amount: string;
      prepaid: string;
      reported_replica_count: string;
      replicas: string;
    };
    MerchantLedger: {
      reward: string;
      collateral: string;
    };
    Releases: {
      _enum: string[];
    };
    Replica: {
      who: string;
      valid_at: string;
      anchor: string;
      is_reported: string;
    };
    Status: {
      _enum: string[];
    };
    UsedInfo: {
      used_size: string;
      reported_group_count: string;
      groups: string;
    };
    Guarantee: {
      targets: string;
      total: string;
      submitted_in: string;
      suppressed: string;
    };
    ValidatorPrefs: {
      guarantee_fee: string;
    };
    IASSig: string;
    Identity: {
      anchor: string;
      punishment_deadline: string;
      group: string;
    };
    ISVBody: string;
    MerkleRoot: string;
    ReportSlot: string;
    PKInfo: {
      code: string;
      anchor: string;
    };
    SworkerAnchor: string;
    SworkerCert: string;
    SworkerCode: string;
    SworkerPubKey: string;
    SworkerSignature: string;
    WorkReport: {
      report_slot: string;
      used: string;
      free: string;
      reported_files_size: string;
      reported_srd_root: string;
      reported_files_root: string;
    };
  };
  Khala: {
    Address: string;
    LookupSource: string;
    Keys: string;
    ChainId: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    ProxyType: {
      _enum: string[];
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Khala Testnet': {
    Address: string;
    LookupSource: string;
    Keys: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    ProxyType: {
      _enum: string[];
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Khala Local Testnet': {
    Address: string;
    LookupSource: string;
    Keys: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    ProxyType: {
      _enum: string[];
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Phala PoC-Next': {
    Address: string;
    LookupSource: string;
    RawSolution: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    Kitty: {
      id: string;
      dna: string;
      price: string;
      gen: string;
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Phala Local Testnet': {
    Address: string;
    LookupSource: string;
    RawSolution: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    Kitty: {
      id: string;
      dna: string;
      price: string;
      gen: string;
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Phala Integration Test': {
    Address: string;
    LookupSource: string;
    RawSolution: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    Kitty: {
      id: string;
      dna: string;
      price: string;
      gen: string;
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Phala Staging Testnet': {
    Address: string;
    LookupSource: string;
    RawSolution: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    Kitty: {
      id: string;
      dna: string;
      price: string;
      gen: string;
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
  'Phala Development': {
    Address: string;
    LookupSource: string;
    RawSolution: string;
    BridgeChainId: string;
    BridgeEvent: {
      _enum: {
        FungibleTransfer: string;
        NonFungibleTransfer: string;
        GenericTransfer: string;
      };
    };
    FungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      amount: string;
      recipient: string;
    };
    NonFungibleTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      tokenId: string;
      recipient: string;
      metadata: string;
    };
    GenericTransfer: {
      destId: string;
      nonce: string;
      resourceId: string;
      metadata: string;
    };
    ResourceId: string;
    TokenId: string;
    DepositNonce: string;
    ProposalStatus: {
      _enum: {
        Initiated: null;
        Approved: null;
        Rejected: null;
      };
    };
    ProposalVotes: {
      votesFor: string;
      votesAgainst: string;
      status: string;
      expiry: string;
    };
    AssetInfo: {
      destId: string;
      assetIdentity: string;
    };
    Kitty: {
      id: string;
      dna: string;
      price: string;
      gen: string;
    };
    Sr25519PublicKey: string;
    MasterPublicKey: string;
    WorkerPublicKey: string;
    ContractPublicKey: string;
    EcdhPublicKey: string;
    MessageOrigin: {
      _enum: {
        Pallet: string;
        Contract: string;
        Worker: string;
        AccountId: string;
        MultiLocation: string;
        Gatekeeper: null;
      };
    };
    Attestation: {
      _enum: {
        SgxIas: string;
      };
    };
    AttestationSgxIas: {
      raReport: string;
      signature: string;
      rawSigningCert: string;
    };
    SenderId: string;
    Path: string;
    Topic: string;
    Message: {
      sender: string;
      destination: string;
      payload: string;
    };
    SignedMessage: {
      message: string;
      sequence: string;
      signature: string;
    };
    WorkerRegistrationInfo: {
      version: string;
      machineId: string;
      pubkey: string;
      ecdhPubkey: string;
      genesisBlockHash: string;
      features: string;
      operator: string;
    };
    PoolInfo: {
      pid: string;
      owner: string;
      payoutCommission: string;
      ownerReward: string;
      cap: string;
      rewardAcc: string;
      totalShares: string;
      totalStake: string;
      freeStake: string;
      releasingStake: string;
      workers: string;
      withdrawQueue: string;
    };
    WithdrawInfo: {
      user: string;
      shares: string;
      startTime: string;
    };
    WorkerInfo: {
      pubkey: string;
      ecdhPubkey: string;
      runtimeVersion: string;
      lastUpdated: string;
      operator: string;
      confidenceLevel: string;
      initialScore: string;
      features: string;
    };
    MinerInfo: {
      state: string;
      ve: string;
      v: string;
      vUpdatedAt: string;
      benchmark: string;
      coolDownStart: string;
      stats: string;
    };
    Benchmark: {
      pInit: string;
      pInstant: string;
      iterations: string;
      miningStartTime: string;
      challengeTimeLast: string;
    };
    MinerState: {
      _enum: {
        Ready: null;
        MiningIdle: null;
        MiningActive: null;
        MiningUnresponsive: null;
        MiningCoolingDown: null;
      };
    };
    MinerStats: {
      totalReward: string;
    };
    HeartbeatChallenge: {
      seed: string;
      onlineTarget: string;
    };
    KeyDistribution: {
      _enum: {
        MasterKeyDistribution: string;
      };
    };
    GatekeeperLaunch: {
      _enum: {
        FirstGatekeeper: string;
        MasterPubkeyOnChain: null;
      };
    };
    GatekeeperChange: {
      _enum: {
        GatekeeperRegistered: string;
      };
    };
    GatekeeperEvent: {
      _enum: {
        NewRandomNumber: string;
        TokenomicParametersChanged: string;
      };
    };
    NewGatekeeperEvent: {
      pubkey: string;
      ecdhPubkey: string;
    };
    DispatchMasterKeyEvent: {
      dest: string;
      ecdhPubkey: string;
      encryptedMasterKey: string;
      iv: string;
    };
    RandomNumberEvent: {
      blockNumber: string;
      randomNumber: string;
      lastRandomNumber: string;
    };
    TokenomicParameters: {
      phaRate: string;
      rho: string;
      budgetPerBlock: string;
      vMax: string;
      costK: string;
      costB: string;
      slashRate: string;
      treasuryRatio: string;
      heartbeatWindow: string;
      rigK: string;
      rigB: string;
      re: string;
      k: string;
      kappa: string;
    };
    TokenomicParams: string;
    U64F64Bits: string;
    UserStakeInfo: {
      user: string;
      locked: string;
      shares: string;
      availableRewards: string;
      rewardDebt: string;
    };
  };
};
export default _default;
