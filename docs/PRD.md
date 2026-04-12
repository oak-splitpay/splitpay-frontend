# Product Requirements Document (PRD): Splitpay

## 1. Overview
**Splitpay** is an open-source, decentralized application (dApp) built on the Stellar blockchain. It allows users to easily split bills with friends, colleagues, or dates and settle those debts instantly using Stellar-supported assets (like XLM or USDC).

## 2. Target Audience
Friends, roommates, and colleagues who frequently share expenses and prefer fast, crypto-native settlements without high gas fees.

## 3. Core Features (MVP)
* **Wallet Integration:** Users can connect their Stellar wallets (e.g., Freighter, Albedo).
* **Bill Creation:** A user can input a total bill amount, a description (e.g., "Sushi Date"), and the number of participants.
* **Link Generation:** The app generates a unique payment link or QR code containing the destination address and specific amount.
* **On-Chain Settlement:** Participants click the link, connect their wallet, and sign the transaction to pay their share.
* **Payment Tracking:** The creator can see who has paid their share in real-time via the Stellar horizon API.

## 4. Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, Stellar SDK, Freighter API.
* **Backend:** NestJS (Node.js), PostgreSQL (optional for caching off-chain data like session names).
* **Blockchain:** Stellar Network (Horizon API / Soroban Smart Contracts).