```txt
TITLE: Solventum Ortho Portal – New Requirements from Kevin & Tegan

SCOPE NOTE
These are incremental capabilities and UX elements called out by Kevin and Tegan during the “Frontend Review” meeting, to be layered on top of the baseline Stryker-style portal (roles, orders, quotes, invoices, products, payments, etc.).

==================================================
1. ROLES & PERSONAS
==================================================

1.1 Core Roles (explicitly called out)
- External:
  - Customer – Orthodontist / Dentist (single practice)
  - Customer – Group / DSO (multi-location)
- Internal:
  - Sales Rep
  - AR (Accounts Receivable)
  - CSR / Customer Operations (CO)

1.2 Role‑Specific Emphasis
- Sales Rep:
  - Fast access to:
    - Customer selector
    - Customer-specific price lists
    - Orders, quotes, invoices per customer
    - Contract status and tiers
- Customer (ortho practice/DSO):
  - Fast access to:
    - Orders, invoices, payment status
    - Current pricing, contracts, promotions
    - Samples, documentation, training, treatment plans (Clarity)
- AR:
  - Focus on:
    - Invoices, aging, payments
    - Contract terms and expirations
    - Discount tiers and consumption vs. thresholds
- CSR / CO:
  - 360° view of:
    - Customer accounts, orders, issues
    - Tickets/cases and portal activity

==================================================
2. NAVIGATION & INFORMATION ARCHITECTURE
==================================================

2.1 Left-Hand Navigation (Customer Portal)
Minimum items Kevin/Tegan want represented:

- Dashboard
- Orders
- Quotes
- Invoices
- Products
- Shipments
- Returns / RMAs
- Documentation
- Training / Education
- Samples
- My Account
- Support (tickets / contact)
- Clarity Portal / Treatment Plans (link + possible embedded view)

2.2 Entry Points / Omnichannel Hooks
- Ability for customers to:
  - Start journey via:
    - Solventum.com public site
    - Partner portal login entry point
    - Clarity Portal (for aligner workflows)
  - “Choose your adventure” from a single place:
    - Aligners / digital therapies
    - Ortho product catalog
    - Other dental portfolios
- Requirement: Customer should perceive “one Solventum” experience even if some experiences are still served by legacy platforms.

2.3 Gated vs Non‑Gated Experience
- Non-gated (public):
  - Product catalog / PDPs with:
    - No pricing (or MSRP only)
    - No request-for-quote / ordering
  - Clear CTA: “Log in to Solventum Portal” or “Log in as Partner”
- Gated (portal):
  - Login-based access to:
    - Pricing, ordering, quotes
    - Account-specific information
    - Invoices, payments, price lists, contracts
- Requirement: Same underlying front-end framework must support both “portal-style” (current mock) and “commerce-style” (public catalog) skins.

==================================================
3. PRODUCT & PRICING CAPABILITIES
==================================================

3.1 Ortho Product Catalog
- Import Solventum Ortho catalog from solventum.com (brackets, bands, etc.).
- Handle:
  - Complex configurations (e.g., bracket location, tooth classification).
  - Filtering by ortho vs general dental.
  - Category navigation improvement vs current site (feedback: ortho too buried).

3.2 Price Lists & Exports
- Role-based visibility:
  - Customers: view/download own price list.
  - Sales Reps: select customer and view/download customer-specific pricing.
- Functional requirements:
  - UI:
    - “Price Lists” menu item.
    - Customer dropdown for Sales Rep role.
    - Columns:
      - SKU / Catalog number
      - Description
      - List Price
      - Customer Price
      - Contract / Tier indicator (see 3.3)
  - Export:
    - CSV export from UI (already prototyped).
    - Works per customer selection for Sales Reps.

3.3 Contract vs Tier-Based Pricing & Visibility
- Distinguish:
  - Standard tier discount (e.g., Tier A default for ortho customers).
  - Contract / formulary pricing for corporate practices / DSOs with:
    - Contract ID / name
    - Start date
    - End date
- Requirements:
  - UI indicator for whether a customer is:
    - On standard tier discount only
    - On contract pricing
  - Notification:
    - Show contract end date and “contract expiring soon” visual cues (e.g., on dashboard and/or Price List page).
  - Data model support for:
    - Discount tiers
    - Contract-based overrides
    - Validity periods

3.4 Volume / Consumption-Based Incentives
- Future-looking requirement (called out explicitly as interesting):
  - Track customer spend/volume on certain categories (e.g., aligners).
  - Calculate progress toward next discount tier (“SkyMiles” analogy).
- Portal behavior:
  - On dashboard:
    - “You are at X% of the way to Tier B / next discount level.”
  - On account/price views:
    - Clear messaging on what is needed to reach next threshold.
- Note: Today this is done manually via Power BI; requirement is to automate and surface in portal.

3.5 Promotions
- On Price List or Account:
  - Show active promotions:
    - Loyalty programs
    - Limited-time offers
  - Attributes:
    - Promotion name
    - Applicability (products / categories)
    - Validity dates
- Requirement: Associate promotions with:
  - Customer
  - Contract
  - Tier (where relevant)

==================================================
4. SAMPLES & ASSETS
==================================================

4.1 Samples Management
- Customers (esp. clinicians) should be able to:
  - Request samples directly from portal.
- Internal acknowledgement:
  - Current state for ortho is “a shit show” with zero-cost orders in A+.
- Requirements:
  - Sample request form:
    - Products / SKUs
    - Quantities
    - Reason / campaign (optional)
  - Route samples through:
    - Either:
      - Explicit “Sample” business interaction type in Viax
    - Or:
      - Marked orders with zero invoice value but traceable type
  - Optionally:
    - Track sample budget per practice/rep in future.

4.2 Documentation & Marketing Assets
- Documentation (SDS, IFUs, product documentation):
  - Download individual documents.
  - Optional: bulk download / export for practice websites.
- Marketing assets:
  - Patient marketing materials
  - Images, brochures, digital banners
- Requirements:
  - Portal section where orthodontists can:
    - Download assets
    - Request printed materials
    - Possibly order demo materials via same flow as samples.

4.3 Integration With External Practice Websites
- The portal should support:
  - Bulk download of product content (text, imagery) so practices can update their own websites.
  - Potential future hook for:
    - Simple API / feed for practices to consume approved product content.

==================================================
5. CLARITY PORTAL & TREATMENT PLANS
==================================================

5.1 Clarity Portal Integration
- Customers already using Clarity for aligners/digital therapies.
- Requirements:
  - Within Solventum Ortho Portal:
    - “Clarity Portal” or “Treatment Plans” link/section:
      - For now: deep-link to Clarity with SSO or tokenized URL.
      - Longer term: embedded widgets / iframes as appropriate.
  - Conceptual framing:
    - Clarity is a tool in the “Andrew ecosystem,” *not* the entire ecosystem.
    - The central portal is the primary “source of truth” entry.

5.2 Treatment Plan Views (Future)
- Potential future requirements:
  - At customer level:
    - “My Treatment Plans” list:
      - Plans, statuses, associated products, invoicing links.
  - Tie treatment plans back to:
    - Orders
    - Invoices
    - Pricing structures

==================================================
6. SUPPORT, TICKETS & INTERNAL VIEWS
==================================================

6.1 Support / Cases
- External customers:
  - View open support tickets / cases.
  - Create new support request from portal.
- Internal CSR/CO roles:
  - See customer issues in same UI:
    - Linked to orders, invoices, shipments where possible.

6.2 Unified Internal Views
- For internal roles (Sales, AR, CSR/CO):
  - Single “Customer 360” style screen:
    - Orders, quotes, invoices, returns
    - Contracts and tiers
    - Promotions and sample usage
    - Portal activity (logins, downloads, etc. – future).

==================================================
7. DASHBOARDS & LANDING EXPERIENCES
==================================================

7.1 Customer Dashboard
- At minimum for ortho customer:
  - Current balance / invoices due
  - Recent orders & shipments
  - Contract status & expiration
  - Tier / loyalty progress (“You’re X% of the way to next discount tier” – future)
  - Quick links:
    - Order again (favorites / frequent items)
    - Download price list
    - Access documentation, training, Clarity Portal

7.2 Sales Rep Dashboard
- For Sales:
  - Customer selector (already prototyped in Price List functionality).
  - At selected customer:
    - Summary metrics:
      - Sales last 30/90 days
      - Current contract & next review date
      - Tier status
      - Open quotes / opportunities
    - Quick access:
      - Download customer-specific price list
      - Place order on behalf of customer
      - Manage samples/promotions for that customer.

==================================================
8. OMNICHANNEL & CUSTOMER INTELLIGENCE
==================================================

8.1 Omnichannel Journey Visibility (Concept)
- Current gap:
  - Solventum “has no idea” where customers come from, what they do, etc.
- Long-term requirement:
  - Capture signals such as:
    - Source (social, email, organic, partner)
    - Page/section navigation
    - Downloaded documents/marketing materials
    - Portal vs public site behavior
  - Feed to:
    - CDP / analytics tooling
    - Exec reporting around customer journey.

8.2 Cross-Property Identity
- Requirement (future-ready):
  - Single identity across:
    - Public web
    - Portal
    - Clarity
    - Partner portal
  - Customer should feel they are dealing with “Wiley-style My Account Hub” but for Solventum dental.

==================================================
9. TECH & IMPLEMENTATION NOTES (FOR REQUIREMENTS)
==================================================

9.1 Composable Execution Layer vs SAP
- Story Kevin/Tegan want to tell:
  - What stays in SAP vs what runs in Viax.
  - Portal / execution layer handles:
    - Customer experience
    - Cross-system orchestration
    - Many customer operations functions (orders, pricing, samples, etc.)
- Requirement for deck + portal demo:
  - Make clear which capabilities are intentionally *not* going into S4.

9.2 Rapid Front-End Iteration
- Expectation:
  - Front-end is flexible and quickly changeable:
    - Layout iterations (catalog, PDP, dashboard)
    - Dynamic role-based experiences.
- Requirement for your build:
  - Keep componentization and configuration such that:
    - Product owners (Kevin/Tegan) can request simple layout/UX changes without large engineering efforts.

==================================================
10. EXECUTIVE PRESENTATION / “NORTH STAR” USE
==================================================

10.1 Visual “North Star” Asset
- This portal will be used to:
  - Socialize a future-state vision with Solventum execs and Raj.
  - Communicate:
    - Unified customer experience
    - De-risking S4
    - CSR headcount reduction opportunities
- Requirement:
  - The demo should:
    - Be credible as an achievable near-term MVP.
    - Clearly hint at future levers (loyalty tiers, omnichannel intelligence, treatment plan integration) without overcomplicating V1.

==================================================
END OF FILE
==================================================
```