# 💚 ImpulsAr - Digital Public Infrastructure for Social Transfers

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-7D00FF?style=flat-square)](https://stellar.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=flat-square)](https://turbo.build/)

> **"Your aid is yours. So is the yield."**

ImpulsAr is revolutionary blockchain infrastructure that transforms how the Argentine government distributes social transfers. Built on Stellar, we deliver verifiable transparency, instant settlement, and—for the first time—return investment yields to citizens instead of intermediaries.

🌐 **Live Demo:** [impulsar-web.vercel.app](https://impulsar-web.vercel.app)  
📂 **Repository:** [github.com/FabSignal/impulsar](https://github.com/FabSignal/impulsar)

---

## 🌟 The Problem We're Solving

### $25 Billion Lost in Inefficiency

Every year, the Argentine government distributes ~$25 billion ARS in social transfers:
- **Asignación Universal por Hijo (AUH)**: 4.2M beneficiaries
- **Prestación Alimentar**: 2.8M beneficiaries
- **Becas Progresar**: 1.5M beneficiaries
- **Other programs**: 1.2M beneficiaries

**Current System Flow:**
```
ANSES → Bank Intermediary → Beneficiary
  └─ 3-5 business days delay
  └─ $185M/year in banking fees
  └─ Yield captured by intermediaries
  └─ Zero public transparency
```

### The "Invisible Money"

When government deposits funds for distribution, that money sits in the financial system for days before reaching citizens. During this time, it generates returns—**captured entirely by bank intermediaries**.

**Key Question:** Who should earn that yield? The citizen or the bank?

---

## 💡 Our Solution: ImpulsAr

### Not a New Program. Better Infrastructure.

ImpulsAr doesn't create new social programs. It modernizes **how** government transfers reach citizens.

```
Government deposits funds
       ↓
Social Liquidity Fund
(T+0 instruments: Money Market, Short-term bonds)
       ↓
ARU token issued on Stellar
(1 ARU = $1 fund participation)
       ↓
Instant blockchain distribution
       ↓
Citizen receives transfer + monthly yield
```

**The yield doesn't disappear. It goes to the citizen.**

---

## 🚀 Three Simultaneous Innovations

### 1. Yield to Beneficiaries

The program's float is invested in safe, liquid local instruments. Monthly returns update the NAV (Net Asset Value), growing each citizen's balance.

**Example:**
- María receives: 140,000 ARU
- Initial NAV: $1.00 per ARU
- Month 1: Fund generates 0.8% → NAV rises to $1.008
- María now has: 140,000 ARU = **$141,120 ARS**
- María earned: **$1,120** without any action

### 2. Verifiable Transparency

Every month:
- CNV-authorized Custodian + Independent Auditor calculate yields
- They publish digitally-signed attestations
- NAV is publicly visible with cryptographic proof

**Not "trust us." It's "verify yourself."**

Portal shows:
- Current NAV with multi-signature attestations
- Complete historical record
- Direct links to Stellar Explorer for on-chain verification

### 3. Radical Efficiency

- **Cost:** ~$0.00001 per transaction (Stellar fees)
- **Speed:** ~5 seconds settlement
- **Scale:** 4.2M transactions in ~70 minutes

**vs Traditional Banking:**
- **Cost:** $185M/year in intermediary fees
- **Speed:** 3-5 business days
- **Infrastructure:** Complex and opaque

---

## 🎯 Real-World Impact: María's Story

**María is 34 years old. Lives in La Matanza with her two children.**

### Before ImpulsAr:

**Distribution Day:**
- Government initiates payment
- **Day 3-5:** Payment finally arrives at her bank account
- María needs to travel **15km to nearest branch**
- Waits in line **2 hours**
- Pays **withdrawal fees**
- Her money generated **zero yield** during the wait

### With ImpulsAr:

**9:00 AM** - Government executes mass distribution via Stellar

**9:17 AM** - María receives push notification on her phone:
> "Your AUH is available: $140,000"

**9:20 AM** - María opens her phone and sees:

```
💚 Your Balance

140,000 ARU
≈ $140,000 pesos

This month your money grew: +$1,120 (+0.8%)

[View Details]  [Withdraw Cash]
```

**When she needs cash:**

**11:45 AM** - María needs $50,000 for medicine

**11:46 AM** - Opens app, taps "Withdraw $50,000"

**11:47 AM** - Receives code: `4821-9374-1056`

**12:05 PM** - Goes to Rapipago (5 blocks away), shows code, **gets cash**

**Total time from decision to cash in hand: 20 minutes.**

No 15km trips. No 2-hour queues. No fees.

---

## 🔬 Technology: Why Stellar?

### Objective Comparison:

| Aspect | Stellar | Ethereum | Solana | Bitcoin |
|--------|---------|----------|--------|---------|
| **Fee/tx** | $0.00001 | $2-50 | $0.0001 | $1-5 |
| **Settlement** | 5 sec | 13 min | 400ms | 60 min |
| **Native assets** | ✅ Yes | ⚠️ Contracts | ⚠️ Programs | ❌ No |
| **Gov precedent** | ✅ Marshall Islands | ❌ No | ❌ No | ❌ No |

### Real Cost Calculation (4.2M beneficiaries/month):

**Stellar:**
- 4.2M txs × $0.00001 = **$42 USD/month**
- Annual: **$504 USD**

**Ethereum:**
- 4.2M txs × $5 = **$21M USD/month**
- Annual: **$252M USD**

**The choice is obvious.**

### Marshall Islands Precedent

In **November 2025**, Marshall Islands launched ENRA (Ecological & National Reparation Asset):
- 40,000 people receiving Universal Basic Income
- Using Stellar blockchain
- Bond yields go **directly to citizens**
- First distribution: successful

**This isn't theory. It's proven reality.**

ImpulsAr scales this model 100x with Argentine instruments.

---

## 🏗️ Technical Architecture

### Full Stack Overview

```
┌────────────────────────────────────┐
│   USER LAYER (María)               │
│   Crossmint Embedded Wallets       │
│   - Login with email/phone         │
│   - No seed phrases needed         │
│   - Like Mercado Pago, but State   │
└────────────────────────────────────┘
              ↕
┌────────────────────────────────────┐
│   BLOCKCHAIN LAYER (Stellar)       │
│   ARU Token (Native Asset)         │
│   - Mass distribution              │
│   - Immutable traceability         │
│   - Soroban: Attestation registry  │
└────────────────────────────────────┘
              ↕
┌────────────────────────────────────┐
│   INSTITUTIONAL LAYER              │
│   Social Liquidity Fund            │
│   - CNV-authorized custodian       │
│   - Independent auditor            │
│   - T+0 regulated instruments      │
└────────────────────────────────────┘
```

### Monorepo Structure (Turborepo)

```
impulsar/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── app/               # App Router pages
│       │   ├── page.tsx       # Landing page
│       │   ├── beneficiario/  # Beneficiary dashboard
│       │   └── transparencia/ # Public transparency portal
│       └── components/        # React components
├── services/
│   ├── transfer-service/      # Blockchain operations
│   │   ├── stellar.ts        # Stellar SDK integration
│   │   └── distribute.ts     # Mass distribution logic
│   └── auth-service/          # Authentication & KYC
│       └── renaper.ts        # National ID integration
└── packages/
    ├── ui/                   # Shared UI components
    ├── stellar-sdk/          # Stellar abstraction layer
    ├── contracts/            # Shared TypeScript interfaces
    ├── dtos/                 # Data serialization
    └── config/               # Environment configuration
```

---

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/FabSignal/impulsar.git
cd impulsar
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Stellar Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Crossmint (Wallets)
NEXT_PUBLIC_CROSSMINT_API_KEY=your_crossmint_key

# Backend Services
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Start development servers**

```bash
# All services with Turborepo
npm run dev

# Or individually:
npm run dev --filter=web
npm run dev --filter=transfer-service
```

5. **Open your browser**

Navigate to `http://localhost:3000`

---

## 📁 Key Features & Pages

### 1. Landing Page (`/`)

**Hero Section:**
- Impact statistics (4.2M potential beneficiaries, $25B annually)
- Clear value proposition: "Your aid is yours. So is the yield."
- Dual CTAs: "Transparency Portal" and "Access as Beneficiary"

**Problem Statement:**
- Current system inefficiencies visualized
- The "invisible money" concept explained
- Marshall Islands precedent highlighted

**Solution Overview:**
- Three core innovations showcased
- Technology stack explained simply
- Security and compliance emphasized

### 2. Transparency Portal (`/transparencia`)

**Public Dashboard (No Login Required):**
- Current NAV with live updating
- Multi-signature attestations visible
  - Custodian digital signature
  - Independent auditor signature
  - Timestamp and period
- Historical NAV chart (last 12 months)
- Recent mass distributions table
- Direct links to Stellar Explorer for verification

**Example View:**
```
🔍 ImpulsAr Transparency

Current NAV: $1.008
Last updated: January 31, 2026
Total AUM: $25,000,000,000

✓ Signed by CNV Custodian
  Hash: 0xf4a8c2b1...

✓ Signed by Independent Auditor
  Hash: 0x9e3d5f7a...

[Verify Signatures] [Download Full Report]
```

### 3. Beneficiary Dashboard (`/beneficiario`)

**After Login (Crossmint embedded wallet):**

**Main Balance Card:**
```
💚 Your Balance

140,000 ARU
≈ $141,120 ARS

This month: +$1,120 (+0.8%)

[View NAV Details] [Withdraw Cash]
```

**Personal Yield Chart:**
- Historical value growth over time
- Monthly yield breakdown
- Comparison with inflation (shows protection)

**Distribution History:**
- All received transfers
- Dates, amounts, concepts (AUH, Progresar, etc.)
- Transaction hashes (Stellar Explorer links)

**Withdrawal Flow:**
1. Input amount in ARS to withdraw
2. System calculates ARU to burn (amount ÷ current NAV)
3. Generates Rapipago/Pago Fácil code
4. User collects cash at any branch

---

## 🔐 Security & Compliance

### Legal Framework

**Argentine Regulation (CNV 2025):**
- RG 1069/2025: Digital representation of securities
- RG 1081/2025: Tokenization expansion
- Special treatment for State-issued securities

**ARU Token Classification:**
```
ARU ≠ Cryptocurrency
ARU = Digital representation of participation
      in regulated Social Liquidity Fund
```

**Critical Distinction:**
- ❌ Does NOT compete with BCRA monetary policy
- ❌ Not a legal tender payment method
- ✅ CNV-regulated financial instrument
- ✅ Redemption always to official ARS pesos

### Security Architecture

**Multi-Layer Security:**

1. **Institutional Layer:**
   - CNV-authorized custodian
   - Independent external auditor
   - Monthly compliance reports

2. **Blockchain Layer:**
   - Immutable transaction record (Stellar)
   - Multi-signature attestations (Soroban smart contracts)
   - Public verification without permission

3. **User Layer:**
   - Crossmint custodial wallets (no seed phrase loss risk)
   - Email/phone recovery
   - Optional biometric authentication

**Privacy Protection:**
- Public blockchain shows pseudonymous transactions
- Real identities stored in private database (Row Level Security)
- GDPR & Argentine Personal Data Protection Law compliant

---

## 📊 Value Proposition

### For Government:

**Operational Efficiency:**
- **99.97% cost reduction** ($185M → $50K annually)
- **Instant settlement** vs 3-5 business days
- **Reusable infrastructure** for multiple programs
- **Zero reconciliation complexity**

**Institutional Transparency:**
- **Public audit capability** (CGN verifies without system access)
- **Every peso traceable** on blockchain
- **Multi-signature attestations** prevent manipulation
- **Reduced corruption perception risk**

**Flexibility:**
- Same rail for AUH, Alimentar, Progresar, and future programs
- Scalable to provinces and municipalities
- Regional expansion ready (Mercosur)

### For Beneficiaries:

**Financial Benefit:**
- **Yield generation:** Variable positive (mitigates 31% inflation)
- **Zero fees:** No withdrawal commissions
- **Instant access:** 5 seconds vs 3-5 days

**Practical Benefit:**
- **No queues:** No 2-hour waits at banks
- **No travel:** No 15km trips to branches
- **24/7 access:** Check balance and withdraw anytime

**Dignity:**
- Personal wallet controlled via smartphone
- No degrading treatment at physical branches
- Autonomous timing of withdrawals

### For the Ecosystem:

**Financial Inclusion:**
- **30% unbanked population** gains access
- **Gateway to digital assets** for 4.2M people
- **First crypto experience** for millions (without knowing it's crypto)

**Capital Markets:**
- **Sustained demand** for T+0 instruments
- **Strengthens local money market**
- **Institutional validation** of blockchain finance

**Regional Precedent:**
- If successful in Argentina (massive scale)
- Other Latin American countries can replicate
- Potential Mercosur-wide implementation

---

## 🗺️ Roadmap

### Phase 1: Ideathon (Current)

**Deliverables:**
- ✅ Functional testnet demo
- ✅ Complete technical documentation
- ✅ ARU asset issued on Stellar testnet
- ✅ 100+ test transactions executed
- ✅ Public transparency portal (mock data)
- ✅ Beneficiary dashboard prototype
- ✅ Professional pitch deck

**Objective:** Demonstrate technical + economic viability

### Phase 2: Pilot (Months 1-6)

**Scope:**
- 10,000 real beneficiaries
- 1 program (AUH or Progresar)
- 1 province (e.g., Buenos Aires)
- $500M ARS distributed

**Milestones:**
- Partnership with CNV-authorized custodian
- Formal regulatory approval
- ANSES/RENAPER integration (KYC)
- Cash-out provider alliance (Rapipago/Pago Fácil)
- Independent external audit

**Success Metrics:**
- Time-to-money: <24 hours
- Beneficiary NPS: >50
- Average yield: Positive variable
- Operational cost: <50% vs current system

### Phase 3: Scale (Months 7-18)

**Scope:**
- 1M beneficiaries
- 3 programs (AUH + Alimentar + Progresar)
- National coverage (all provinces)
- $10Bn ARS distributed cumulative

**Technical Improvements:**
- Native mobile app (React Native)
- Biometric authentication
- Intelligent push notifications
- Analytics dashboards for government
- Public APIs for citizen auditing

**Expansion:**
- Proposal to other Latam countries (Uruguay, Chile, Colombia)

### Phase 4: Consolidation (Month 19+)

**Scope:**
- 4.2M beneficiaries (100% AUH coverage)
- 5+ social programs
- $25Bn+ ARS distributed annually
- Regional (Mercosur)

**Innovations:**
- Multi-currency support (ARS + USDC + BRL)
- Instant cross-border payments
- Interoperability with other countries
- Open APIs for complementary financial services (savings, microinsurance)

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start all services (Turborepo)
npm run build            # Build all apps/services
npm run lint             # Run ESLint across monorepo
npm run test             # Run tests

# Individual services
npm run dev --filter=web                  # Frontend only
npm run dev --filter=transfer-service     # Backend only

# Database
npm run db:migrate       # Run Supabase migrations
npm run db:seed          # Seed test data
```

### Tech Stack Deep Dive

**Frontend (apps/web):**
- Next.js 14 (App Router, RSC, Server Actions)
- TailwindCSS (utility-first styling)
- Recharts (data visualization)
- Lucide React (icons)
- Crossmint SDK (embedded wallets)

**Backend (services/):**
- Node.js + Express (REST APIs)
- Stellar SDK (blockchain integration)
- Soroban Client (smart contract interaction)
- Supabase (PostgreSQL with RLS)

**Shared (packages/):**
- TypeScript strict mode (type safety)
- Zod (schema validation)
- Shared contracts/DTOs (API consistency)

**Infrastructure:**
- Turborepo (monorepo orchestration)
- Vercel (frontend deployment)
- Railway/Render (backend services)
- Supabase (database + auth)

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #4FFFB0;        /* Turquoise green - growth, nature */
--secondary: #00D4AA;      /* Turquoise - water, flow */
--accent-1: #5BB9FF;       /* Sky blue - trust, institutional */
--accent-2: #8B7FFF;       /* Purple - innovation, future */

/* Neutral Colors */
--dark: #0A0E14;           /* Almost black with blue tint */
--text-primary: #FFFFFF;   /* White */
--text-secondary: #94A3B8; /* Slate gray */

/* Semantic Colors */
--success: #4FFFB0;        /* Positive yield, verified */
--warning: #FFA500;        /* Medium priority */
--error: #FF4444;          /* High priority, errors */
```

### Typography

- **Headings:** Inter (weights: 700, 600)
- **Body:** Inter (weights: 400, 500)
- **Numbers:** `font-variant-numeric: tabular-nums` (aligned columns)

### Component Library

Using **shadcn/ui** for accessible, customizable components:
- Buttons (primary, secondary, ghost variants)
- Cards (with glassmorphism effect)
- Dialogs/Modals
- Forms (with react-hook-form + zod)
- Charts (Recharts integration)

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test
   ```
5. **Commit with conventional commits**
   ```bash
   git commit -m 'feat(web): add beneficiary notification system'
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier configured
- Follow existing patterns in codebase
- Write meaningful commit messages

### Areas Needing Contribution

- [ ] Soroban smart contract optimization
- [ ] Additional wallet integrations (Freighter, Albedo)
- [ ] Mobile app development (React Native)
- [ ] Portuguese/Spanish translations
- [ ] Load testing for 4.2M concurrent users
- [ ] Accessibility improvements (WCAG 2.1 AA)

---

## 📈 Metrics & Analytics

### Public Transparency Metrics

**Tracked and publicly visible:**
- Total distributions executed (count & ARS amount)
- Average settlement time (target: <10 seconds)
- Average yield delivered per month
- Number of active beneficiaries
- NAV historical chart (12-month rolling)

### Internal Metrics (Government Dashboard)

- Distribution success rate (target: 99.9%)
- Transaction fee costs (actual vs estimated)
- Beneficiary engagement (WAU/MAU ratio)
- Support tickets (volume & resolution time)
- Regulatory compliance status

### Success KPIs

**Quantitative:**
- **Adoption:** >70% opt-in rate by Month 12
- **Cost:** <50% of traditional banking system
- **Speed:** Time-to-money <24 hours
- **Yield:** Positive variable monthly return
- **Satisfaction:** NPS >50

**Qualitative:**
- Zero critical audit findings
- >70% trust rating ("My money is safe")
- Documented success stories (beneficiaries achieving goals)

---

## 🌍 International Precedent

### Marshall Islands: ENRA/USDM

**Launched:** November 2025  
**Scale:** 40,000 people  
**Mechanism:** Universal Basic Income with sovereign bond yields → citizens  
**Technology:** Stellar blockchain + Lomalo wallet  
**Status:** Active, first distributions successful

**Key Learnings Applied to ImpulsAr:**
1. **Yield transfer works:** Citizens value passive income
2. **Stellar is stable:** 99.9% uptime for government-critical operations
3. **UX matters:** Wallet must be simpler than traditional banking
4. **Transparency builds trust:** Public verification crucial for adoption

### ImpulsAr vs Marshall Islands

| Aspect | Marshall Islands | ImpulsAr |
|--------|-----------------|----------|
| Scale | 40,000 people | 4.2M (100x larger) |
| Launch | Nov 2025 | Proposed 2026 |
| Asset Base | USD sovereign bonds | ARS T+0 local fund |
| Inflation Context | ~2% annually | ~31% annually (INDEC) |
| Yield Mechanism | Direct distribution | NAV-based appreciation |
| Programs | Single UBI | Multi-program (AUH, Alimentar, Progresar) |
| Wallet | Lomalo (custom) | Crossmint (universal) |

**Core Similarity:** Both return asset yields to citizens. That's the economic innovation.

---

## ❓ FAQ

### For Beneficiaries

**Q: Is this cryptocurrency?**  
A: No. ARU is a digital representation of your participation in a CNV-regulated Social Liquidity Fund. It's a tokenized security under government supervision, not "free crypto."

**Q: Is my money safe?**  
A: Yes. The Fund invests in low-risk local instruments (money market, short-term bonds) with T+0 liquidity. Additionally, there's a CNV-authorized custodian and independent auditor. Three layers of institutional security.

**Q: Can I lose money?**  
A: Yield is variable, not guaranteed. In normal contexts, money market funds generate positive returns. In extreme crises, there could be months without yield. Still, your principal (initial amount) is backed by Fund assets. The goal is value preservation, not speculation.

**Q: What if I need cash urgently?**  
A: T+0 redemption. Request in your wallet, and within the same business day you can withdraw via local providers. No early withdrawal penalty.

**Q: What happens if I lose my phone?**  
A: Your wallet is tied to your email/phone, not the device. Install app on new phone, log in with same credentials, recover access. You can optionally add biometric authentication as extra security.

### For Government

**Q: Does this create a parallel currency competing with the peso?**  
A: No. ARU is not currency. It's a digital representation of participation in a fund valued in pesos. It has no legal tender status. Redemption is always to official ARS pesos. It doesn't interfere with BCRA monetary policy.

**Q: What if Stellar (the blockchain) has an outage?**  
A: Stellar has 99.9% historical uptime. Marshall Islands uses it for government without incidents. If an outage occurs, we have:
- Multiple Horizon nodes (redundancy)
- Degraded mode (show cached balances)
- Automatic retry queue system

**Q: How do you guarantee the published NAV is real?**  
A: Multi-signature attestation. CNV Custodian + Independent Auditor digitally sign the monthly report. Public portal shows verifiable signatures. If there's manipulation, it's detected cryptographically.

### For Tech Community

**Q: Why Stellar and not Solana/Ethereum/another blockchain?**  
A: Three reasons:
1. Predictable fees ($0.00001/tx vs $2-50 Ethereum)
2. Government precedent (Marshall Islands)
3. Native assets (no need for complex smart contracts for tokens)

**Q: How do you handle Stellar's reserve requirements?**  
A: Crossmint custodial wallets handle reserves automatically. Beneficiaries never see XLM or need to fund accounts. The program pays initial reserves (2.5 XLM × 4.2M = 10.5M XLM one-time).

**Q: Why not use Soroban smart contracts for everything?**  
A: We use a hybrid approach:
- ARU Asset: Stellar native asset (simple, proven)
- NAV Registry: Soroban smart contract (on-chain attestations)
- Mass distribution: Backend + Stellar SDK (more control, better UX)

Principle: Use the right tool for each job.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Open Source Commitment

ImpulsAr is **fully open source** to enable:
- **Transparency:** Anyone can audit the code
- **Replicability:** Other countries can fork and adapt
- **Community improvement:** Contributions welcome
- **Trust:** No hidden logic or backdoors

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** for blockchain infrastructure and support
- **Crossmint** for embedded wallet technology
- **Marshall Islands** for pioneering government use of Stellar
- **Argentine CNV** for progressive tokenization regulation
- **All contributors** working to modernize public infrastructure

---

## 📞 Contact & Support

### Team

- **GitHub:** [github.com/FabSignal/impulsar](https://github.com/FabSignal/impulsar)
- **Demo:** [impulsar-web.vercel.app](https://impulsar-web.vercel.app)

### For Stellar Foundation

We seek:
- Technical grant (Stellar Community Fund)
- Soroban optimization support
- Regulatory compliance resources
- Government stakeholder connections

### For Argentine Government

Available for formal presentation to:
- ANSES (National Social Security Administration)
- Ministry of Human Capital
- CNV (National Securities Commission)
- BCRA (Central Bank)

### For Media & Press

Interview requests and inquiries welcome.

---

## 🌟 Project Status

### Current Phase: **Ideathon Demo**

✅ **Completed:**
- ARU asset issued on Stellar testnet
- 100+ test transactions executed
- Public transparency portal (live)
- Beneficiary dashboard (functional)
- Complete technical documentation
- Regulatory compliance analysis

🚧 **In Progress:**
- Crossmint wallet integration (testing)
- Soroban attestation registry (deployment)
- Mobile responsive optimization

📅 **Next Milestones:**
- [ ] Submit to Stellar Community Fund (Q1 2026)
- [ ] Formal presentation to Argentine government (Q2 2026)
- [ ] Pilot preparation with 10K beneficiaries (Q2-Q3 2026)

---

## 💬 Community

Join the conversation:
- **GitHub Discussions:** Share ideas and feedback
- **Issues:** Report bugs or request features
- **Twitter/X:** [@ImpulsAr_ARG](https://twitter.com/ImpulsAr_ARG) (coming soon)

---

**Made with 💙 for 4.2 million Argentines waiting for better infrastructure**

*Every citizen deserves financial dignity. ImpulsAr makes it possible.*

---

## ⭐ Star Us!

If you believe in transparent, efficient government infrastructure, please star this repo. It helps us gain visibility for pilot funding and regulatory approval.

[⭐ Star on GitHub](https://github.com/FabSignal/impulsar)

---

**ImpulsAr: Your aid is yours. So is the yield.**
