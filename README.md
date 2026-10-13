# SplitPay Frontend 💸

[![CI](https://github.com/oak-splitpay/splitpay-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/oak-splitpay/splitpay-frontend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue.svg)](https://stellar.org/)

The open-source web application for **SplitPay** — a decentralized, zero-custody bill splitting application that settles shared expenses directly on the Stellar blockchain with microsecond finality and near-zero fees.

---

## 🔗 Architecture & Ecosystem

SplitPay is architected as two decoupled, interoperable repositories:
1. **`oak-splitpay/splitpay-frontend` (This Repository)**: The user-facing dApp built with Next.js 14, Tailwind CSS, TypeScript, and `@stellar/freighter-api`.
2. **[`oak-splitpay/splitpay-backend-contract`](https://github.com/oak-splitpay/splitpay-backend-contract)**: The on-chain Soroban smart contract (`contracts/`) enforcing multi-session accounting, peer-to-peer token transfers, and double-payment prevention, alongside the NestJS metadata indexing API (`src/`).

```
┌─────────────────────────────────┐
│     splitpay-frontend (Next.js) │
│  - Freighter Wallet Connect     │
│  - Split Creation Wizard        │
│  - Live Payment Tracker         │
│  - Duplicate Click Guard        │
└───────────────┬─────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────────┐  ┌──────────────────────────────────┐
│ NestJS Indexer   │  │ Soroban Smart Contract           │
│ (Backend API)    │  │ (contracts/src/lib.rs)           │
│ - Session Meta   │  │ - Multi-Session State            │
│ - REST Endpoints │  │ - Peer-to-Peer Token Settlement  │
│ - Status Cache   │  │ - Double-Payment Prevention Guard│
└──────────────────┘  └──────────────────────────────────┘
```

---

## 🌟 Key Features

- **Freighter Wallet Integration (`components/WalletConnect.tsx`)**:
  - Secure connection with automatic network switching (Stellar Testnet & Futurenet).
  - Session persistence via `localStorage` to preserve connected status across refreshes.
  - Dedicated Testnet fallback mode for automated testing environments.
- **Interactive Split Creation (`components/BillForm.tsx` & `app/page.tsx`)**:
  - Real-time calculation of per-person share with rounding protection.
  - Generates shareable payment links with unique split session IDs.
- **Live On-Chain Payment Tracker (`components/PaymentTracker.tsx`)**:
  - Shows real-time settlement status (`Paid`, `Pending`, `Failed`).
  - Progress bar reflecting paid proportions.
  - One-click "Pay Now" action for participants with duplicate payment prevention.
  - Displays confirmed transaction hashes with direct links to the [Stellar Expert](https://stellar.expert/explorer/testnet) block explorer.
- **Automated CI/CD (`.github/workflows/ci.yml`)**:
  - Automated GitHub Actions workflow running full Next.js production builds and TypeScript typechecks.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI & Styling**: React 18, Tailwind CSS, Lucide React
- **Blockchain SDKs**: `@stellar/freighter-api`, `@stellar/stellar-sdk`
- **Language**: TypeScript 5

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- [Freighter Wallet Browser Extension](https://www.freighter.app/)

### Installation

```bash
# Clone the repository
git clone https://github.com/oak-splitpay/splitpay-frontend.git
cd splitpay-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
```

---

## 🌐 Live Stellar Testnet Evidence

The frontend workflow was verified end-to-end against the Stellar Testnet:
- **Verified Timestamp**: `2026-10-13T15:03:43Z`
- **Network**: Stellar Testnet (`https://horizon-testnet.stellar.org`)
- **Split Session ID**: `1791903815791`
- **Ledger Sequence**: `5176047`
- **Payer Account**: [`GCN74D5M3ORI6N5KHOOZECJJK5CDPPAIMYI33ZQ6CUSVY5NULSH7ALNR`](https://stellar.expert/explorer/testnet/account/GCN74D5M3ORI6N5KHOOZECJJK5CDPPAIMYI33ZQ6CUSVY5NULSH7ALNR)
- **Receiver Account**: [`GCLIQJUZ3GBBFAAC244RGJ3AENPAMF2S2ROU6P5KTPNXBPV3TGJV7QDA`](https://stellar.expert/explorer/testnet/account/GCLIQJUZ3GBBFAAC244RGJ3AENPAMF2S2ROU6P5KTPNXBPV3TGJV7QDA)
- **Settlement Transaction Hash**: [`44a7e8b0d1110ae839981e0f2e1de003d4081cc693d9c629c811b36255c56c91`](https://stellar.expert/explorer/testnet/tx/44a7e8b0d1110ae839981e0f2e1de003d4081cc693d9c629c811b36255c56c91)
- **Observed Results**:
  - Participant 1 successfully debited 50 XLM.
  - Receiver credited 50 XLM on-chain.
  - UI state transitioned to `Paid` with transaction hash link.
  - Duplicate payment prevention guard successfully blocked subsequent payments.

---

## 🤝 Contributing

We welcome community contributions! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

### Contributor Backlog
Check our [Issues](https://github.com/oak-splitpay/splitpay-frontend/issues) for open tasks:
- QR Code invoice generation modal for mobile participants.
- Multi-asset currency selector (USDC / XLM) in split creation.
- WalletConnect v2 fallback adapter for mobile Stellar wallets.

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).
