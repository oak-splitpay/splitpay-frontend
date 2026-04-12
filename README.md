# Splitpay - Split Bills on Stellar

Splitpay is an open-source dApp built on the Stellar network that takes the awkwardness out of splitting the bill. Settle shared expenses instantly using blockchain technology with minimal fees and no middleman.

##  Features

- **Instant Settlement** - Pay on the Stellar blockchain in seconds
- **Zero Custody** - Funds go directly peer-to-peer; Splitpay never holds user assets
- **Secure Transactions** - Cryptographically signed transactions via Stellar wallets
- **Real-time Tracking** - See payment status updates as they happen
- **Shareable Links** - Generate unique payment links with QR codes
- **Low Fees** - Stellar network microfees (no expensive gas)

##  Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  - Landing Page / UI Components                           │   │
│  │  - Bill Form Component                                    │   │
│  │  - Wallet Connection (Freighter API)                     │   │
│  │  - Payment Tracker                                        │   │
│  │  - TypeScript + Tailwind CSS                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
              ▼                                    ▼
    ┌─────────────────┐            ┌──────────────────────────┐
    │  Stellar SDK    │            │  Freighter Wallet        │
    │  (JS SDK v12)   │            │  Extension               │
    └─────────────────┘            └──────────────────────────┘
              ▼                                    ▼
    ┌───────────────────────────────────────────────────────┐
    │         Stellar Network (Horizon API)                 │
    │  - Transaction signing & submission                   │
    │  - Payment verification                               │
    │  - Account management                                 │
    └───────────────────────────────────────────────────────┘
```

### Component Architecture

#### Frontend Components

1. **BillForm** - `components/BillForm.tsx`
   - Form for creating bill splits
   - Input validation
   - Real-time per-person calculation
   - Error handling

2. **WalletConnect** - `components/WalletConnect.tsx`
   - Freighter wallet integration
   - Connect/disconnect functionality
   - Address display
   - Mock wallet support for testing

3. **PaymentTracker** - `components/PaymentTracker.tsx`
   - Display payment status for each participant
   - Progress tracking
   - Status indicators (paid/pending/failed)

4. **Landing Page** - `app/page.tsx`
   - Hero section with value proposition
   - Feature highlights
   - Navigation between pages
   - Create split workflow

### Tech Stack

#### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS 3
- **Language:** TypeScript 5
- **Blockchain:** Stellar JS SDK 12
- **Wallet:** Freighter API 2.2
- **HTTP Client:** Axios
- **Icons:** Lucide React

#### Infrastructure
- **Runtime:** Node.js 18+
- **Package Manager:** npm/yarn
- **Build Tool:** Next.js (Webpack)

### Data Flow

1. **Split Creation**
   - User enters bill details (amount, participants, description)
   - Frontend calculates per-person amount
   - Split session created with unique ID
   - Shareable link & QR code generated

2. **Payment Settlement**
   - Participants receive shareable link
   - Connect Stellar wallet via Freighter
   - Review transaction details
   - Sign transaction with private key
   - Transaction submitted to Stellar network
   - Payment verified via Stellar Horizon API

3. **Status Updates**
   - Real-time polling of transaction status
   - Update UI when payments are confirmed
   - Display final settlement status

## Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- A Stellar testnet wallet (Freighter browser extension recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/splitpay.git
   cd splitpay-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (optional)
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
splitpay-frontend/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main landing page / app UI
│   └── globals.css          # Global Tailwind styles
├── components/
│   ├── BillForm.tsx         # Bill creation form
│   ├── WalletConnect.tsx    # Wallet connection component
│   └── PaymentTracker.tsx   # Payment status tracker
├── public/                  # Static assets
├── docs/                    # Documentation
│   └── PRD.md              # Product requirements
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## 🔄 Workflow

### For Bill Creator
1. Navigate to "Create Split"
2. Enter occasion, total amount, and number of participants
3. Optionally add notes
4. System calculates per-person amount
5. Generate shareable link
6. Connect wallet and confirm initial transaction
7. Track payments in real-time

### For Bill Participants
1. Receive shareable link from bill creator
2. Click link to open Splitpay
3. Review split details
4. Connect Stellar wallet
5. Approve transaction in wallet
6. Payment sent to creator's address
7. Status updated on tracker

## 🔐 Security Considerations

- **No Private Keys Stored** - All key management handled by Freighter
- **On-Chain Verification** - All transactions verified via Stellar Horizon
- **No Intermediate Custody** - Funds transfer directly peer-to-peer
- **Signed Transactions** - All transactions cryptographically signed


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or reach out via our [community](https://telegram.org) channels.

