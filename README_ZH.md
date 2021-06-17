## 使用教程

### 环境准备

#### 1.安装 chrome 扩展程序 polkadot.js

本应用不会保存您的账户私钥，所有链上交易需通过 polkadot.js 扩展程序完成签名操作。因此，请务必安装 polkadot.js 扩展程序，并创建账户。

[下载链接](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)

<p align="center">
  <img src="./docs/1_download.png" style="width:800px";>
</p>

#### 2.安装 chrome 扩展程序 polkadot.js

如果您已经安装了 polkadot.js 扩展程序，进入页面将自动连接。请为 SUBSCAN_Multisig 授权。

<p align="center">
  <img src="./docs/2_auth.png" style="width:800px";>
</p>

### 添加/删除 多签账号

#### 1.添加多签账号

- 点击「创建钱包」
  <p align="center">
    <img src="./docs/3_create_wallet.png" style="width:800px";>
  </p>
- 按页面要求输入多签账号的相关数据，确认无误后，点击「创建」。

  \*名称：本多签账号的备注名，将存储在本地。

  \*阈值：每笔交易成功发送所需要的批准成员数量的最小值，最小输入值为 2。

  \*成员：多签账号的参与成员，最小数量为 2，最大数量为 100。
  <p align="center">
    <img src="./docs/4_add_members.png" style="width:800px";>
  </p>

#### 2.管理多签账号

- 查看多签账号成员
  <p align="left">
    点击
    <img src="./docs/btn_member.png" width="30px">
    可显示/隐藏 多签账号的成员（备注名，账号，状态）
  </p>

  \*本地账号（Injected）：指本地 polkadot.js 扩展程序 中存在的账户，可用于签名。

  \*外部账号（External）：指指本地 polkadot.js 扩展程序 中不存在的账户，不可用于签名。

  <p align="center">
    <img src="./docs/5_view_members.png" style="width:800px";>
  </p>

- 管理多签账号
  <p align="left">
    1. 点击
    <img src="./docs/btn_detail.png" width="30px">
    进入多签账号详情
  </p>

  <p align="center">
    <img src="./docs/6_enter_detail.png" style="width:800px";>
  </p>

  <p align="left">
    2. 在多签账号详情里，点击「设置」，可进行「更改名称」「删除」等操作。
  </p>

  <p align="center">
    <img src="./docs/7_account_ops.png" style="width:800px";>
  </p>

### 多签转账

#### 1.发起 多签转账

点击「发起交易」，输入交易参数，确认无误后点击「发送」

\*目前仅支持转账操作，第二阶段将支持更多交易类型。

\*发起多签交易的成员账号，需要保留一定数量的通证，具体数额视网络而定。如可用的余额不足，交易将失败并报“LiquidityRestrictions”的错误。

  <p align="center">
    <img src="./docs/8_initial_extrinsic.png" style="width:800px";>
  </p>

#### 2.授权 多签转账

- <p align="left">
    如图所示，
    <img src="./docs/btn_pending.png" width="30px">
    上有红点，表示该多签账户有未完成交易。
  </p>

  <p align="center">
    <img src="./docs/9_pending.png" style="width:800px";>
  </p>

- 点击进入多签账户详情，确认交易无误后，点击「批准」，并发送交易。

  \*外部发起的交易，call data 可能未储存在链上或数据库里，因此在最后一笔「批准并执行」的交易中，需要手动填入 call data。

  <p align="center">
    <img src="./docs/10_approve.png" style="width:800px";>
  </p>

- 当进度达到阈值后，会自动执行。
  <p align="center">
    <img src="./docs/11_progress.png" style="width:800px";>
  </p>

#### 3.取消 多签转账

仅交易发起人有权限取消多签交易，点击「取消」并签名交易即可取消。

  <p align="center">
    <img src="./docs/12_cancel.png" style="width:800px";>
  </p>
