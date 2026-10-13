# Security Policy

## Reporting Security Issues

We prioritize the security of SplitPay and its wallet integrations. If you identify a potential security issue in the frontend client, please report it privately.

### Responsible Disclosure Guidelines
- **Do NOT** open public issues for security vulnerabilities.
- Report issues to `security@splitpay.app` or via GitHub Security Advisories.
- Please detail the issue, the affected browser/environment, wallet interaction behavior, and reproduction steps.
- We will acknowledge within 48 hours and coordinate fixes promptly.

### Scope
- Wallet signature request handling (`@stellar/freighter-api`).
- Transaction payload formulation and parameter sanitization.
- LocalStorage state caching security and session replay protection.
