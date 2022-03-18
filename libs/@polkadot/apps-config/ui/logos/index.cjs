'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.specLogos =
  exports.nodeLogos =
  exports.namedLogos =
  exports.externalLogos =
  exports.extensionLogos =
  exports.emptyLogos =
  exports.chainLogos =
    void 0;

var _util = require('../util.cjs');

var _acala = _interopRequireDefault(require('./chains/acala.svg'));

var _aleph = _interopRequireDefault(require('./chains/aleph.svg'));

var _altair = _interopRequireDefault(require('./chains/altair.svg'));

var _astar = _interopRequireDefault(require('./chains/astar.png'));

var _coinversation = _interopRequireDefault(require('./chains/coinversation.png'));

var _competitorsClub = _interopRequireDefault(require('./chains/competitors-club.png'));

var _composableFinance = _interopRequireDefault(require('./chains/composableFinance.png'));

var _crownSterling = _interopRequireDefault(require('./chains/crown-sterling.png'));

var _dusty = _interopRequireDefault(require('./chains/dusty.png'));

var _efinity = _interopRequireDefault(require('./chains/efinity.svg'));

var _equilibrium = _interopRequireDefault(require('./chains/equilibrium.svg'));

var _genshiro = _interopRequireDefault(require('./chains/genshiro.svg'));

var _hydrate = _interopRequireDefault(require('./chains/hydrate.png'));

var _interlay = _interopRequireDefault(require('./chains/interlay.svg'));

var _karura = _interopRequireDefault(require('./chains/karura.svg'));

var _kintsugi = _interopRequireDefault(require('./chains/kintsugi.png'));

var _kusama = _interopRequireDefault(require('./chains/kusama-128.gif'));

var _opalLogo = _interopRequireDefault(require('./chains/opal-logo.png'));

var _parallel = _interopRequireDefault(require('./chains/parallel.svg'));

var _picasso = _interopRequireDefault(require('./chains/picasso.svg'));

var _quartz = _interopRequireDefault(require('./chains/quartz.png'));

var _rococo = _interopRequireDefault(require('./chains/rococo.svg'));

var _rococoCanvas = _interopRequireDefault(require('./chains/rococo-canvas.svg'));

var _rococoTick = _interopRequireDefault(require('./chains/rococo-tick.svg'));

var _rococoTrack = _interopRequireDefault(require('./chains/rococo-track.svg'));

var _rococoTrick = _interopRequireDefault(require('./chains/rococo-trick.svg'));

var _shiden = _interopRequireDefault(require('./chains/shiden.png'));

var _snakenet = _interopRequireDefault(require('./chains/snakenet.svg'));

var _spanner = _interopRequireDefault(require('./chains/spanner.png'));

var _standard = _interopRequireDefault(require('./chains/standard.png'));

var _unique = _interopRequireDefault(require('./chains/unique.svg'));

var _unorthodox = _interopRequireDefault(require('./chains/unorthodox.png'));

var _polkadotJs = _interopRequireDefault(require('./extensions/polkadot-js.svg'));

var _commonwealth = _interopRequireDefault(require('./external/commonwealth.png'));

var _dotreasury = _interopRequireDefault(require('./external/dotreasury.svg'));

var _dotscanner = _interopRequireDefault(require('./external/dotscanner.png'));

var _polkascan = _interopRequireDefault(require('./external/polkascan.png'));

var _polkassembly = _interopRequireDefault(require('./external/polkassembly.png'));

var _polkastats = _interopRequireDefault(require('./external/polkastats.png'));

var _singular = _interopRequireDefault(require('./external/singular.svg'));

var _statescan = _interopRequireDefault(require('./external/statescan.svg'));

var _subid = _interopRequireDefault(require('./external/subid.svg'));

var _subscan = _interopRequireDefault(require('./external/subscan.svg'));

var _subsquare = _interopRequireDefault(require('./external/subsquare.svg'));

var _apron = _interopRequireDefault(require('./nodes/apron.png'));

var _ares = _interopRequireDefault(require('./nodes/ares.png'));

var _aresGladios = _interopRequireDefault(require('./nodes/ares-gladios.svg'));

var _aresMars = _interopRequireDefault(require('./nodes/ares-mars.png'));

var _astar2 = _interopRequireDefault(require('./nodes/astar.png'));

var _automata = _interopRequireDefault(require('./nodes/automata.png'));

var _basilisk = _interopRequireDefault(require('./nodes/basilisk.png'));

var _beast = _interopRequireDefault(require('./nodes/beast.svg'));

var _bifrost = _interopRequireDefault(require('./nodes/bifrost.svg'));

var _bitcountry = _interopRequireDefault(require('./nodes/bitcountry.svg'));

var _calamari = _interopRequireDefault(require('./nodes/calamari.png'));

var _centrifuge = _interopRequireDefault(require('./nodes/centrifuge.png'));

var _chainx = _interopRequireDefault(require('./nodes/chainx.svg'));

var _clover = _interopRequireDefault(require('./nodes/clover.svg'));

var _coinversation2 = _interopRequireDefault(require('./nodes/coinversation.png'));

var _competitorsClub2 = _interopRequireDefault(require('./nodes/competitors-club.png'));

var _crab = _interopRequireDefault(require('./nodes/crab.svg'));

var _crownSterling2 = _interopRequireDefault(require('./nodes/crown-sterling.png'));

var _crust = _interopRequireDefault(require('./nodes/crust.svg'));

var _crustMaxwell = _interopRequireDefault(require('./nodes/crust-maxwell.svg'));

var _crustParachain = _interopRequireDefault(require('./nodes/crustParachain.svg'));

var _darwinia = _interopRequireDefault(require('./nodes/darwinia.png'));

var _datahighway = _interopRequireDefault(require('./nodes/datahighway.png'));

var _dockMainnet = _interopRequireDefault(require('./nodes/dock-mainnet.png'));

var _dockTestnet = _interopRequireDefault(require('./nodes/dock-testnet.png'));

var _dolphin = _interopRequireDefault(require('./nodes/dolphin.svg'));

var _dotmog = _interopRequireDefault(require('./nodes/dotmog.svg'));

var _eave = _interopRequireDefault(require('./nodes/eave.svg'));

var _edgewareWhite = _interopRequireDefault(require('./nodes/edgeware-white.png'));

var _efinity2 = _interopRequireDefault(require('./nodes/efinity.svg'));

var _encointerBlue = _interopRequireDefault(require('./nodes/encointer-blue.svg'));

var _fantour = _interopRequireDefault(require('./nodes/fantour.png'));

var _galitalLogo = _interopRequireDefault(require('./nodes/galital-logo.png'));

var _gamepower = _interopRequireDefault(require('./nodes/gamepower.svg'));

var _geek = _interopRequireDefault(require('./nodes/geek.svg'));

var _hanonycash = _interopRequireDefault(require('./nodes/hanonycash.svg'));

var _idavoll = _interopRequireDefault(require('./nodes/idavoll.png'));

var _integritee = _interopRequireDefault(require('./nodes/integritee.svg'));

var _interlay2 = _interopRequireDefault(require('./nodes/interlay.svg'));

var _ipse = _interopRequireDefault(require('./nodes/ipse.png'));

var _jupiter = _interopRequireDefault(require('./nodes/jupiter.svg'));

var _khala = _interopRequireDefault(require('./nodes/khala.svg'));

var _kilt = _interopRequireDefault(require('./nodes/kilt.png'));

var _klug = _interopRequireDefault(require('./nodes/klug.png'));

var _konomi = _interopRequireDefault(require('./nodes/konomi.png'));

var _kulupu = _interopRequireDefault(require('./nodes/kulupu.svg'));

var _kusari = _interopRequireDefault(require('./nodes/kusari.svg'));

var _kylin = _interopRequireDefault(require('./nodes/kylin.png'));

var _laminarCircle = _interopRequireDefault(require('./nodes/laminar-circle.svg'));

var _litentry = _interopRequireDefault(require('./nodes/litentry.png'));

var _loom_network = _interopRequireDefault(require('./nodes/loom_network.png'));

var _manta = _interopRequireDefault(require('./nodes/manta.png'));

var _math = _interopRequireDefault(require('./nodes/math.svg'));

var _moonbeam = _interopRequireDefault(require('./nodes/moonbeam.png'));

var _moonriver = _interopRequireDefault(require('./nodes/moonriver.svg'));

var _moonrock = _interopRequireDefault(require('./nodes/moonrock.png'));

var _moonshadow = _interopRequireDefault(require('./nodes/moonshadow.png'));

var _mybank = _interopRequireDefault(require('./nodes/mybank.png'));

var _nftmart = _interopRequireDefault(require('./nodes/nftmart.png'));

var _nodle = _interopRequireDefault(require('./nodes/nodle.svg'));

var _oak = _interopRequireDefault(require('./nodes/oak.png'));

var _opalLogo2 = _interopRequireDefault(require('./nodes/opal-logo.png'));

var _opportunity = _interopRequireDefault(require('./nodes/opportunity.png'));

var _origintrail = _interopRequireDefault(require('./nodes/origintrail.png'));

var _pangolin = _interopRequireDefault(require('./nodes/pangolin.svg'));

var _pangoro = _interopRequireDefault(require('./nodes/pangoro.svg'));

var _parallel2 = _interopRequireDefault(require('./nodes/parallel.svg'));

var _parami = _interopRequireDefault(require('./nodes/parami.png'));

var _phala = _interopRequireDefault(require('./nodes/phala.svg'));

var _phoenix = _interopRequireDefault(require('./nodes/phoenix.png'));

var _pichiu = _interopRequireDefault(require('./nodes/pichiu.png'));

var _pioneer = _interopRequireDefault(require('./nodes/pioneer.png'));

var _plasm = _interopRequireDefault(require('./nodes/plasm.png'));

var _polkadex = _interopRequireDefault(require('./nodes/polkadex.svg'));

var _polkadotCircle = _interopRequireDefault(require('./nodes/polkadot-circle.svg'));

var _polkadotJs2 = _interopRequireDefault(require('./nodes/polkadot-js.svg'));

var _polkafoundry = _interopRequireDefault(require('./nodes/polkafoundry.svg'));

var _polkasmith = _interopRequireDefault(require('./nodes/polkasmith.svg'));

var _polymesh = _interopRequireDefault(require('./nodes/polymesh.svg'));

var _pontem = _interopRequireDefault(require('./nodes/pontem.svg'));

var _prism = _interopRequireDefault(require('./nodes/prism.png'));

var _quartz2 = _interopRequireDefault(require('./nodes/quartz.png'));

var _realis = _interopRequireDefault(require('./nodes/realis.png'));

var _riochain = _interopRequireDefault(require('./nodes/riochain.svg'));

var _robonomics = _interopRequireDefault(require('./nodes/robonomics.svg'));

var _sakura = _interopRequireDefault(require('./nodes/sakura.svg'));

var _shadow = _interopRequireDefault(require('./nodes/shadow.svg'));

var _shell = _interopRequireDefault(require('./nodes/shell.svg'));

var _sherpax = _interopRequireDefault(require('./nodes/sherpax.png'));

var _singlavender = _interopRequireDefault(require('./nodes/singlavender.svg'));

var _soraSubstrate = _interopRequireDefault(require('./nodes/sora-substrate.svg'));

var _stafi = _interopRequireDefault(require('./nodes/stafi.png'));

var _statemine = _interopRequireDefault(require('./nodes/statemine.svg'));

var _subdao = _interopRequireDefault(require('./nodes/subdao.png'));

var _subgame = _interopRequireDefault(require('./nodes/subgame.svg'));

var _subsocial = _interopRequireDefault(require('./nodes/subsocial.svg'));

var _subspace = _interopRequireDefault(require('./nodes/subspace.png'));

var _substrateContractsNode = _interopRequireDefault(require('./nodes/substrate-contracts-node.png'));

var _substrateHexagon = _interopRequireDefault(require('./nodes/substrate-hexagon.svg'));

var _ternoa = _interopRequireDefault(require('./nodes/ternoa.svg'));

var _trustbase = _interopRequireDefault(require('./nodes/trustbase.png'));

var _uniarts = _interopRequireDefault(require('./nodes/uniarts.png'));

var _unique2 = _interopRequireDefault(require('./nodes/unique.svg'));

var _unitv = _interopRequireDefault(require('./nodes/unitv.png'));

var _valiu = _interopRequireDefault(require('./nodes/valiu.png'));

var _web3games = _interopRequireDefault(require('./nodes/web3games.svg'));

var _westend_colour = _interopRequireDefault(require('./nodes/westend_colour.svg'));

var _westlake = _interopRequireDefault(require('./nodes/westlake.png'));

var _whala = _interopRequireDefault(require('./nodes/whala.svg'));

var _zCloak = _interopRequireDefault(require('./nodes/zCloak.svg'));

var _zeitgeist = _interopRequireDefault(require('./nodes/zeitgeist.png'));

var _zenlink = _interopRequireDefault(require('./nodes/zenlink.svg'));

var _zero = _interopRequireDefault(require('./nodes/zero.svg'));

var _empty = _interopRequireDefault(require('./empty.svg'));

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */
// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)
// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
// last-resort fallback, just something empty
// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
const chainLogos = Object.entries({
  'Aleph Zero': _aleph.default,
  'Aleph Zero Testnet': _aleph.default,
  Altair: _altair.default,
  'Apron PC1': _apron.default,
  'Ares Gladios': _aresGladios.default,
  'Ares Odyssey': _aresGladios.default,
  'Ares PC1': _ares.default,
  Astar: _astar.default,
  Automata: _automata.default,
  'Automata ContextFree': _automata.default,
  'Beast Developer': _beast.default,
  Bifrost: _bifrost.default,
  'Bifrost Asgard CC4': _bifrost.default,
  'Calamari Parachain': _calamari.default,
  'Calamari Parachain Development': _calamari.default,
  'Calamari Parachain Local': _calamari.default,
  'Calamari Parachain Testnet': _calamari.default,
  Canvas: _rococoCanvas.default,
  ChainX: _chainx.default,
  'Charcoal Testnet': _centrifuge.default,
  Coinversation: _coinversation.default,
  'Competitors Club': _competitorsClub.default,
  'Crown Sterling': _crownSterling.default,
  'Crust Maxwell': _crustMaxwell.default,
  'Crust PC1': _crust.default,
  'darwinia crab': _crab.default,
  'Darwinia Crab PC2': _crab.default,
  'Darwinia PC2': _darwinia.default,
  DataHighway: _datahighway.default,
  'Dolphin Testnet': _dolphin.default,
  Dusty: _dusty.default,
  Efinity: _efinity.default,
  Equilibrium: _equilibrium.default,
  EquilibriumTestnet: _equilibrium.default,
  Galital: _galitalLogo.default,
  'GamePower Network': _gamepower.default,
  GEEK: _geek.default,
  Genshiro: _genshiro.default,
  'Genshiro Rococo Testnet': _equilibrium.default,
  HydraDX: _snakenet.default,
  'HydraDX Hydrate': _hydrate.default,
  'HydraDX Snakenet': _snakenet.default,
  'HydraDX Snakenet Gen2': _snakenet.default,
  'HydraDX Snakenet Gen3': _snakenet.default,
  Idavoll: _idavoll.default,
  InterBTC: _interlay2.default,
  'InterBTC Staging': _interlay2.default,
  Interlay: _interlay.default,
  IpseTestnet: _ipse.default,
  'Jupiter A1': _jupiter.default,
  'Jupiter PC1': _jupiter.default,
  Karura: _karura.default,
  KILT: _kilt.default,
  'KILT Local': _kilt.default,
  'KILT Peregrine': _kilt.default,
  'KILT Testnet': _kilt.default,
  Kintsugi: _kintsugi.default,
  KlugDossier: _klug.default,
  Konomi: _konomi.default,
  Kpron: _apron.default,
  Kusama: _kusama.default,
  // new name after CC3
  'Kusama CC1': _kusama.default,
  'Kusama CC2': _kusama.default,
  'Kusama CC3': _kusama.default,
  kusari: _kusari.default,
  'Kylin Testnet': _kylin.default,
  Litentry: _litentry.default,
  'Loom Network Local': _loom_network.default,
  LoomNetwork: _loom_network.default,
  'Manta Parachain': _manta.default,
  'Manta Parachain Development': _manta.default,
  'Manta Parachain Local': _manta.default,
  'Manta Parachain Testnet': _manta.default,
  Mars: _aresMars.default,
  MathChain: _math.default,
  'MathChain PC1': _math.default,
  'mathchain-galois': _math.default,
  'Moonbase Alpha': _moonbeam.default,
  'Moonbase Development Testnet': _moonbeam.default,
  'Moonbase Stage': _moonbeam.default,
  Moonbeam: _moonbeam.default,
  Moonriver: _moonriver.default,
  Moonrock: _moonrock.default,
  Moonshadow: _moonshadow.default,
  'mybank.network PC1': _mybank.default,
  'Neumann Network': _oak.default,
  NFTMart: _nftmart.default,
  'NFTMart Staging': _nftmart.default,
  'NFTMart Testnet': _nftmart.default,
  'OPAL by UNIQUE': _opalLogo.default,
  'OriginTrail Parachain': _origintrail.default,
  'OriginTrail Parachain Testnet': _origintrail.default,
  Pangolin: _pangolin.default,
  Pangoro: _pangoro.default,
  Parallel: _parallel.default,
  'Parallel Heiko': _parallel.default,
  'Parami PC2': _parami.default,
  'Phala PC1': _phala.default,
  'PHOENIX PC1': _phoenix.default,
  'Pichiu Mainnet': _pichiu.default,
  'Pichiu Testnet': _pichiu.default,
  'Pioneer Network': _pioneer.default,
  'Polkadex Mainnet': _polkadex.default,
  'Polkadex Testnet': _polkadex.default,
  'PolkaFoundry PC1': _polkafoundry.default,
  'Pontem Testnet': _pontem.default,
  'Prism PC1': _prism.default,
  'Prism Testnet': _prism.default,
  'QUARTZ by UNIQUE': _quartz.default,
  'ReAlis Network': _realis.default,
  'RioChain CC-1': _riochain.default,
  'RioChain Staging': _riochain.default,
  Robonomics: _robonomics.default,
  Rococo: _rococo.default,
  Sherpax: _sherpax.default,
  'Sherpax Testnet': _sherpax.default,
  Shiden: _shiden.default,
  SingLavender: _singlavender.default,
  SORA: _soraSubstrate.default,
  Spanner: _spanner.default,
  Statemine: _statemine.default,
  'Statemine Test': _statemine.default,
  'Statemint Test': _statemine.default,
  'Steam PC': _eave.default,
  subdao: _subdao.default,
  'SubDAO PC1': _subdao.default,
  'SubDAO Staging': _subdao.default,
  subgame: _subgame.default,
  'SubGame Gamma': _subgame.default,
  'SubGame Staging': _subgame.default,
  Subsocial: _subsocial.default,
  'Subsocial PC': _subsocial.default,
  subspace: _subspace.default,
  Tick: _rococoTick.default,
  Track: _rococoTrack.default,
  Trick: _rococoTrick.default,
  trustbase: _trustbase.default,
  'TrustBase PC1': _trustbase.default,
  'uni arts staging network': _uniarts.default,
  'UniArts Mainnet': _uniarts.default,
  Unique: _unique.default,
  'Unit Network': _unitv.default,
  Unorthodox: _unorthodox.default,
  Vln: _valiu.default,
  'VLN PC': _valiu.default,
  'Web3Games Plum': _web3games.default,
  Westend: _westend_colour.default,
  Westlake: _westlake.default,
  Westmint: _statemine.default,
  'Westmint Test': _statemine.default,
  WILT: _kilt.default,
  'zcloak poc1': _zCloak.default,
}).reduce((logos, _ref) => {
  let [chain, logo] = _ref;
  return { ...logos, [(0, _util.sanitize)(chain)]: logo };
}, {}); // Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC

exports.chainLogos = chainLogos;
const nodeLogos = Object.entries({
  'Acala Node': _acala.default,
  'Apron Node': _apron.default,
  'Apron Parachain Collator': _apron.default,
  'Ares Gladios': _aresGladios.default,
  'Ares Node': _ares.default,
  'Ares Parachain Collator': _ares.default,
  Astar: _astar2.default,
  'Automata ContextFree Node': _automata.default,
  'Automata Node': _automata.default,
  Basilisk: _basilisk.default,
  'Beast Node': _beast.default,
  Bifrost: _bifrost.default,
  'Bifrost Node': _bifrost.default,
  'Bit Country Tewai Parachain Collator': _bitcountry.default,
  'Bit.Country': _bitcountry.default,
  'BitCountry Node': _bitcountry.default,
  'Calamari Parachain Collator': _calamari.default,
  Centrifuge: _centrifuge.default,
  'centrifuge chain': _centrifuge.default,
  'Centrifuge Chain Node': _centrifuge.default,
  'ChainX Node': _chainx.default,
  'Clover Node': _clover.default,
  Coinversation: _coinversation2.default,
  'Competitors Club': _competitorsClub2.default,
  'Crown Sterling': _crownSterling2.default,
  crust: _crust.default,
  'Crust Collator': _crust.default,
  'Crust Maxwell': _crustMaxwell.default,
  darwinia: _darwinia.default,
  'darwinia crab': _crab.default,
  'darwinia parachain': _darwinia.default,
  'Darwinia Runtime Module Library': _darwinia.default,
  DataHighway: _datahighway.default,
  'DataHighway Node': _datahighway.default,
  'DataHighway Parachain Collator': _datahighway.default,
  'Dock Full Node': _dockMainnet.default,
  'DOTMog Node': _dotmog.default,
  'Eave Node': _eave.default,
  'Edgeware Node': _edgewareWhite.default,
  'Efinity Node': _efinity2.default,
  'Encointer collator': _encointerBlue.default,
  'Encointer Node noTEE': _encointerBlue.default,
  'Fantour Node': _fantour.default,
  'Galital Parachain Collator': _galitalLogo.default,
  'GamePower Node': _gamepower.default,
  GEEK: _geek.default,
  'Halongbay Parachain Collator': _polkafoundry.default,
  hanonycash: _hanonycash.default,
  'Idavoll Node': _idavoll.default,
  'Integritee Collator': _integritee.default,
  'Integritee Node': _integritee.default,
  Interlay: _interlay.default,
  IpseTestnet: _ipse.default,
  Khala: _khala.default,
  'Khala Node': _khala.default,
  KILT: _kilt.default,
  'KILT Local': _kilt.default,
  'KILT Peregrine': _kilt.default,
  Kintsugi: _kintsugi.default,
  'Klug Dossier Node': _klug.default,
  'Kpron Collator': _apron.default,
  kulupu: _kulupu.default,
  kusari: _kusari.default,
  'Kylin Node': _kylin.default,
  'Laminar Node': _laminarCircle.default,
  Litentry: _litentry.default,
  'Litentry Collator': _litentry.default,
  'mandala node': _acala.default,
  'Manta Node': _manta.default,
  'Manta Parachain Collator': _manta.default,
  MathChain: _math.default,
  'mathChain-galois': _math.default,
  Moonrock: _moonrock.default,
  'mybank.network': _mybank.default,
  'Neumann Network': _oak.default,
  NFTMart: _nftmart.default,
  'NFTMart Staging': _nftmart.default,
  'NFTMart Testnet': _nftmart.default,
  'node-template': _substrateHexagon.default,
  'Nodle Chain Node': _nodle.default,
  'Opal Node': _opalLogo2.default,
  'Opportunity Standalone Testnet': _opportunity.default,
  'OriginTrail Parachain': _origintrail.default,
  'OriginTrail Parachain Testnet': _origintrail.default,
  Pangolin: _pangolin.default,
  Pangoro: _pangoro.default,
  Parallel: _parallel2.default,
  'Parallel Heiko': _parallel2.default,
  Parami: _parami.default,
  'parity-polkadot': _polkadotCircle.default,
  'Patract Node': _jupiter.default,
  'Phala Collator': _phala.default,
  'phala-substrate-node': _phala.default,
  'PHOENIX Collator': _phoenix.default,
  'PHOENIX Node': _phoenix.default,
  'Pichiu Node': _pichiu.default,
  'Pioneer Network Collator Node': _pioneer.default,
  Plasm: _plasm.default,
  'Plasm Node': _plasm.default,
  'Plasm Parachain Collator': _plasm.default,
  'Polkadex Node': _polkadex.default,
  'polkadot-js': _polkadotJs2.default,
  'PolkaFoundry Node': _polkafoundry.default,
  'PolkaFoundry Parachain Collator': _polkafoundry.default,
  'PolkaSmith Parachain Collator': _polkasmith.default,
  'Pontem Testnet': _pontem.default,
  'Prism Collator': _prism.default,
  'Prism Node': _prism.default,
  'Quartz Node': _quartz2.default,
  'ReAlis Network': _realis.default,
  'Rio Defi Chain Node': _riochain.default,
  'RioChain Staging': _riochain.default,
  robonomics: _robonomics.default,
  Sakura: _sakura.default,
  Shadow: _shadow.default,
  sherpax: _sherpax.default,
  'Shiden Collator': _shiden.default,
  'SingLavender Parachain Collator': _singlavender.default,
  Sora: _soraSubstrate.default,
  Stafi: _stafi.default,
  'Stafi Node': _stafi.default,
  'Statemine Collator': _statemine.default,
  'Statemint Collator': _statemine.default,
  subdao: _subdao.default,
  'SubDAO Collator': _subdao.default,
  'SubDAO Staging': _subdao.default,
  subgame: _subgame.default,
  'SubGame Gamma': _subgame.default,
  'SubGame Staging': _subgame.default,
  'Subsocial Node': _subsocial.default,
  'Subsocial PC': _subsocial.default,
  'subsocial-node': _subsocial.default,
  subspace: _subspace.default,
  'substrate-contracts-node': _substrateContractsNode.default,
  'substrate-node': _substrateHexagon.default,
  'subzero node': _zero.default,
  'Ternoa Node': _ternoa.default,
  'TrustBase Collator': _trustbase.default,
  'TrustBase Node': _trustbase.default,
  'uni arts node': _uniarts.default,
  'UniArts Node': _uniarts.default,
  'Unique Node': _unique2.default,
  'Unit Collator': _unitv.default,
  'Unit Node': _unitv.default,
  Vln: _valiu.default,
  'VLN PC': _valiu.default,
  'Web3Games Node': _web3games.default,
  Westend: _westend_colour.default,
  Westlake: _westlake.default,
  'Westmint Collator': _statemine.default,
  Whala: _whala.default,
  'Whala Node': _whala.default,
  WILT: _kilt.default,
  'zcloak node': _zCloak.default,
  'Zeitgeist Collator': _zeitgeist.default,
  'Zeitgeist Node': _zeitgeist.default,
  Zenlink: _zenlink.default,
  'Zenlink Collator': _zenlink.default,
}).reduce((logos, _ref2) => {
  let [node, logo] = _ref2;
  return { ...logos, [(0, _util.sanitize)(node)]: logo };
}, {}); // Alphabetical overrides based on the actual specName

exports.nodeLogos = nodeLogos;
const specLogos = Object.entries({
  shell: _shell.default,
  statemine: _statemine.default,
  statemint: _statemine.default,
  westmint: _statemine.default,
}).reduce((logos, _ref3) => {
  let [spec, logo] = _ref3;
  return { ...logos, [(0, _util.sanitize)(spec)]: logo };
}, {}); // Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)

exports.specLogos = specLogos;
const namedLogos = {
  acala: _acala.default,
  aleph: _aleph.default,
  alexander: _polkadotCircle.default,
  altair: _altair.default,
  'Ares Gladios': _aresGladios.default,
  astar: _astar.default,
  automata: _automata.default,
  'automata-contextfree': _automata.default,
  basilisk: _basilisk.default,
  beast: _beast.default,
  bifrost: _bifrost.default,
  bitcountry: _bitcountry.default,
  bitcountryPioneer: _pioneer.default,
  calamari: _calamari.default,
  centrifuge: _centrifuge.default,
  chainx: _chainx.default,
  charcoal: _centrifuge.default,
  clover: _clover.default,
  coinversation: _coinversation.default,
  'competitors-club': _competitorsClub.default,
  composableFinance: _composableFinance.default,
  crab: _crab.default,
  'crown-sterling': _crownSterling.default,
  crust: _crust.default,
  'Crust Maxwell': _crustMaxwell.default,
  crustParachain: _crustParachain.default,
  darwinia: _darwinia.default,
  datahighway: _datahighway.default,
  'dock-pos-mainnet': _dockMainnet.default,
  'dock-pos-testnet': _dockTestnet.default,
  dolphin: _dolphin.default,
  dotmog: _dotmog.default,
  dusty: _dusty.default,
  eave: _eave.default,
  edgeware: _edgewareWhite.default,
  efinity: _efinity2.default,
  empty: _empty.default,
  encointer: _encointerBlue.default,
  equilibrium: _equilibrium.default,
  fantour: _fantour.default,
  galital: _galitalLogo.default,
  galois: _math.default,
  gamepower: _gamepower.default,
  geek: _geek.default,
  genshiro: _genshiro.default,
  halongbay: _polkafoundry.default,
  hanonycash: _hanonycash.default,
  heiko: _parallel.default,
  hydra: _snakenet.default,
  idavoll: _idavoll.default,
  integritee: _integritee.default,
  interbtc: _interlay2.default,
  interlay: _interlay.default,
  ipse: _ipse.default,
  jupiter: _jupiter.default,
  karura: _karura.default,
  khala: _khala.default,
  kilt: _kilt.default,
  kintsugi: _kintsugi.default,
  klugdossier: _klug.default,
  kpron: _apron.default,
  kulupu: _kulupu.default,
  kusama: _kusama.default,
  kusari: _kusari.default,
  kylin: _kylin.default,
  laminar: _laminarCircle.default,
  litentry: _litentry.default,
  loomNetwork: _loom_network.default,
  manta: _manta.default,
  mars: _aresMars.default,
  mathchain: _math.default,
  moonbaseAlpha: _moonbeam.default,
  moonbeam: _moonbeam.default,
  moonriver: _moonriver.default,
  moonrock: _moonrock.default,
  moonshadow: _moonshadow.default,
  mybank: _mybank.default,
  neumann: _oak.default,
  nftmart: _nftmart.default,
  nodle: _nodle.default,
  odyssey: _aresGladios.default,
  opal: _opalLogo2.default,
  opportunity: _opportunity.default,
  'origintrail-parachain-testnet': _origintrail.default,
  pangolin: _pangolin.default,
  pangoro: _pangoro.default,
  parallel: _parallel.default,
  phala: _phala.default,
  phoenix: _phoenix.default,
  picasso: _picasso.default,
  pichiu: _pichiu.default,
  plasm: _plasm.default,
  polkadex: _polkadex.default,
  polkadot: _polkadotCircle.default,
  polkafoundry: _polkafoundry.default,
  polkasmith: _polkasmith.default,
  polymesh: _polymesh.default,
  pontem: _pontem.default,
  prism: _prism.default,
  quartz: _quartz2.default,
  realis: _realis.default,
  riochain: _riochain.default,
  robonomics: _robonomics.default,
  rocky: _crust.default,
  rococo: _rococo.default,
  rococoAcala: _acala.default,
  rococoApron: _apron.default,
  rococoAres: _ares.default,
  rococoBifrost: _bifrost.default,
  rococoBitCountry: _bitcountry.default,
  rococoCanvas: _rococoCanvas.default,
  rococoChainX: _chainx.default,
  rococoClover: _clover.default,
  rococoCrab: _crab.default,
  rococoCrust: _crust.default,
  rococoDarwinia: _darwinia.default,
  rococoDataHighway: _datahighway.default,
  rococoEave: _eave.default,
  rococoEncointer: _encointerBlue.default,
  rococoGalital: _galitalLogo.default,
  rococoGenshiro: _genshiro.default,
  rococoHydrate: _hydrate.default,
  rococoIdavoll: _idavoll.default,
  rococoInterBTC: _interlay.default,
  rococoJupiter: _jupiter.default,
  rococoKilt: _kilt.default,
  rococoKonomi: _konomi.default,
  rococoKylin: _kylin.default,
  rococoLaminar: _laminarCircle.default,
  rococoLitentry: _litentry.default,
  rococoLoomNetwork: _loom_network.default,
  rococoManta: _manta.default,
  rococoMathChain: _math.default,
  rococoMoonrock: _moonrock.default,
  rococoOriginTrail: _origintrail.default,
  rococoParami: _parami.default,
  rococoPhala: _phala.default,
  rococoPhoenix: _phoenix.default,
  rococoPlasm: _plasm.default,
  rococoPolkaFoundry: _polkafoundry.default,
  rococoPrism: _prism.default,
  rococoSingLavender: _singlavender.default,
  rococoStandard: _standard.default,
  rococoStatemint: _statemine.default,
  rococoSubDAO: _subdao.default,
  rococoSubsocial: _subsocial.default,
  rococoTick: _rococoTick.default,
  rococoTrack: _rococoTrack.default,
  rococoTrick: _rococoTrick.default,
  rococoTrustBase: _trustbase.default,
  rococoUnitv: _unitv.default,
  rococoVln: _valiu.default,
  rococoZeitgeist: _zeitgeist.default,
  rococoZenlink: _zenlink.default,
  sakura: _sakura.default,
  shadow: _shadow.default,
  shell: _shell.default,
  sherpax: _sherpax.default,
  shibuya: _shiden.default,
  shiden: _shiden.default,
  singLavender: _singlavender.default,
  snakenet: _snakenet.default,
  sora: _soraSubstrate.default,
  'sora-substrate': _soraSubstrate.default,
  spanner: _spanner.default,
  stafi: _stafi.default,
  statemine: _statemine.default,
  statemint: _statemine.default,
  subdao: _subdao.default,
  'SubDAO PC1': _subdao.default,
  'SubDAO Staging': _subdao.default,
  subgame: _subgame.default,
  'SubGame Gamma': _subgame.default,
  'SubGame Staging': _subgame.default,
  subsocial: _subsocial.default,
  subspace: _subspace.default,
  'subspace-farmnet': _subspace.default,
  substrate: _substrateHexagon.default,
  substrateContractsNode: _substrateContractsNode.default,
  'ternoa-testnet': _ternoa.default,
  trustbase: _trustbase.default,
  uniarts: _uniarts.default,
  unique: _unique2.default,
  unitv: _unitv.default,
  unorthodox: _unorthodox.default,
  vln: _valiu.default,
  web3games: _web3games.default,
  westend: _westend_colour.default,
  westendPichiu: _pichiu.default,
  westendStandard: _standard.default,
  westlake: _westlake.default,
  westmint: _statemine.default,
  whala: _whala.default,
  zCloak: _zCloak.default,
  zeitgeist: _zeitgeist.default,
  zero: _zero.default,
}; // extension logos

exports.namedLogos = namedLogos;
const extensionLogos = {
  'polkadot-js': _polkadotJs.default,
}; // external logos, i.e. for explorers

exports.extensionLogos = extensionLogos;
const externalLogos = {
  commonwealth: _commonwealth.default,
  dotreasury: _dotreasury.default,
  dotscanner: _dotscanner.default,
  polkascan: _polkascan.default,
  polkassembly: _polkassembly.default,
  polkastats: _polkastats.default,
  singular: _singular.default,
  statescan: _statescan.default,
  subid: _subid.default,
  subscan: _subscan.default,
  subsquare: _subsquare.default,
}; // empty logos

exports.externalLogos = externalLogos;
const emptyLogos = {
  empty: _empty.default,
}; // preload all

exports.emptyLogos = emptyLogos;
[chainLogos, extensionLogos, externalLogos, namedLogos, nodeLogos, emptyLogos].forEach((imageSet) => {
  Object.values(imageSet).forEach((src) => {
    new Image().src = src;
  });
});
