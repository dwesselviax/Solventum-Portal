# Stryker B2B Portal — Demo Flow & Transcript

> **Duration:** ~25–30 minutes
> **Presenter notes:** Text in *italics* is spoken narration. `[Action]` denotes clicks/interactions. Items in **bold** are key talking points to emphasize.

---

## Pre-Demo Setup

- Browser: Chrome, incognito recommended (clears sessionStorage)
- URL: `http://localhost:3000`
- Screen: 1440×900 or higher recommended
- Have this script on a second screen or printout

---

## ACT 1: Login & Sales Rep View (Full Platform Tour)

*We'll start with the Sales Rep role because it has the broadest access — every section of the portal is visible. This lets us tour the full platform in one pass. Then we'll switch roles to highlight what changes for each persona.*

### Scene 1.1 — Login Page

`[Navigate to http://localhost:3000 — you'll be redirected to /login]`

*"This is the Stryker B2B Portal login page, powered by the viax Revenue Execution platform. In production this authenticates against Keycloak with OpenID Connect. For this demo, we have four one-click quick-login buttons representing our four user personas."*

**Point out on screen:**
- Stryker logo and viax branding
- Standard email/password form
- Four quick-login cards at the bottom, each showing role name + email

`[Click the "Sales Rep" quick-login button]`

*"Let's start as Emily Rodriguez, our Regional Sales Manager covering the Pacific Northwest territory."*

---

### Scene 1.2 — Dashboard

`[Dashboard loads at /dashboard]`

*"The dashboard is the command center. Let's walk through each section."*

**KPI Cards (top row of 4):**

*"At the top we have four KPI cards. Total Revenue shows $2.84 million with a 12.5% upward trend. Active Orders at 8 — up 23.1%. Pending Quotes at 3, up 15.4%. And Active Subscriptions at 4, down 5.2%. Each card shows a trend arrow and percentage versus the prior period."*

**Revenue Chart:**

*"Below that is a six-month revenue trend line — August through January — plotted in Stryker gold. You can see the upward trajectory peaking in December at about $520K before a January dip."*

**Monthly Goals (Progress Rings):**

*"On the right, two progress rings show monthly targets. Orders are at 22 of 30 — 73% — and Revenue is at $352K of a $415K goal — 85%. These give a quick gut check on where the team stands."*

**Recent Activity:**

*"The Recent Activity feed pulls from live order data. We can see the latest order updates — statuses like Confirmed, Shipped, Delivered — with timestamps and dollar amounts."*

**Action Items:**

*"Action Items is a task list. Notice the color-coded priority icons: red alert for high-priority items like 'Review pending quote for Mercy Health,' gray circles for standard tasks, and green checks for completed ones."*

**Quick Actions:**

*"Finally, four quick-action cards at the bottom: New Quote, View Orders, Browse Products, and Get Support. These are the most common workflows, one click away."*

`[Click "View Orders" quick action]`

---

### Scene 1.3 — Orders List

`[Orders page loads at /orders]`

*"Here's the Orders list. Every column header is sortable — click once for ascending, again for descending."*

`[Click the "Order ID" column header to demonstrate sorting]`

*"We can filter by status using this dropdown..."*

`[Click the Status filter dropdown, show options: Draft, Submitted, Confirmed, Shipped, Delivered, Invoiced, Cancelled]`

*"...and search by order ID, customer name, or description in the search bar."*

`[Type "Mako" in the search bar — the list filters to show ORD-2025-0001]`

*"Each row shows the order ID, customer, description, status with a color-coded badge, date, and total amount. Let's drill into this Mako SmartRobotics order."*

`[Click on the ORD-2025-0001 row]`

---

### Scene 1.4 — Order Detail

`[Order detail page loads at /orders/ORD-2025-0001]`

*"The order detail page has a header with the order ID, description, status badge, and created date. Below that are four party cards."*

**Party Cards:**

*"Customer card shows Northwest Medical Center in Seattle. Ship-To is their Surgical Robotics Suite. Bill-To is their finance department. And the Sales Rep card shows Emily Rodriguez — that's us — with her territory and contact info."*

**Line Items Table:**

*"The line items table breaks down every product on this order: the Mako SmartRobotics System at $1.25 million, Triathlon Knee implants at $8,500 each — 10 units — and Trident II Acetabular Cups at $6,800 each — 8 units. Each line shows the unit price, any discount percentage, and the calculated line total."*

**Price Summary:**

*"The price summary rolls everything up: subtotal of $1.39 million, minus a 3% volume discount of $41,700, plus 8.9% tax and $2,500 freight, arriving at a grand total of $1.31 million."*

**Timeline:**

*"At the bottom, a timeline tracks the order lifecycle: created on January 15, submitted the same day, and confirmed on January 18. Each event is marked with a gold dot on the vertical timeline."*

`[Click the back arrow / "Back to Orders" link at the top]`

---

### Scene 1.5 — Creating a New Order

`[Back on /orders, click the "New Order" button in the top right]`

*"The New Order form slides in from the right as a sheet overlay. Let's walk through it."*

**Form fields:**

*"We select a customer from the dropdown — these are pre-loaded accounts. Then a description field. The Ship-To section has address fields that would auto-populate from the customer's registered locations."*

**Dynamic Line Items:**

*"The line items section is dynamic. We pick a product from the dropdown..."*

`[Click the Product dropdown to show the list of products with prices]`

*"Notice it shows the product name and price inline. When we select one, the unit price auto-fills. We set the quantity, add optional notes per line, and can click 'Add Line Item' to add more rows, or the trash icon to remove one."*

`[Click Cancel to close the form without creating]`

---

### Scene 1.6 — Quotes List & Detail

`[Click "Quotes" in the sidebar]`

*"The Quotes section follows the same pattern — sortable table, status filters, search. Quotes have validity dates shown in the 'Valid Until' column. Statuses include Draft, Submitted, Approved, Rejected, and Converted."*

*"Let's look at an Approved quote that's ready for conversion."*

`[Click on QT-2025-0002 — "Mercy Health Bed Replacement Phase 2", status: Approved]`

**Quote Detail:**

*"Same layout as order detail — party cards, line items, price summary, timeline. But notice two additional buttons in the header area."*

**Convert to Order:**

`[Point to the "Convert to Order" button]`

*"This 'Convert to Order' button only appears on Approved quotes. Clicking it would create a new order pre-populated with all the quote data and change the quote status to Converted. This is the quote-to-order pipeline in action."*

**Export PDF:**

`[Point to the "Export PDF" button]`

*"And 'Export PDF' generates a downloadable quote document for the customer."*

`[Navigate back to the sidebar]`

---

### Scene 1.7 — Invoices & Payment

`[Click "Invoices" in the sidebar]`

*"Invoices track the financial lifecycle. Status badges are color-coded: green for Paid, yellow for Open, red for Overdue, and blue-ish for Partial payment."*

`[Click on INV-2025-0010 — Open, $1.26M]`

**Invoice Detail:**

*"The invoice detail shows customer and billing cards, payment terms — Net 45 in this case — line items, and the price summary. Two key action buttons here."*

`[Point to "Download PDF" and "Pay Now" buttons]`

*"Download PDF for record-keeping, and **Pay Now** which appears on Open and Overdue invoices. Clicking Pay Now would initiate the payment workflow."*

`[Navigate back to Invoices list]`

*"Notice INV-2024-0008 here is marked Overdue in red — $6,944 for Pacific Surgical. The Pay Now button is also available on overdue invoices, flagging urgency."*

---

### Scene 1.8 — Subscriptions

`[Click "Subscriptions" in the sidebar]`

*"Subscriptions manage recurring deliveries of consumable products. Each row shows the product, delivery frequency — Monthly, Quarterly, Bi-Weekly — quantity per delivery, status, and next delivery date."*

`[Click on SUB-001 — Neptune 3 Waste Management Canisters, Active, Monthly]`

**Subscription Detail:**

*"The detail page shows the product, frequency, quantity, price per delivery — $5,440 — start date, and next delivery date. The delivery address is shown below."*

**Lifecycle Actions:**

*"Three action buttons manage the subscription lifecycle: **Pause** temporarily suspends deliveries, **Resume** reactivates a paused subscription, and **Cancel** permanently ends it. Each action triggers an immediate status update with a confirmation toast."*

`[Click "Pause" to demonstrate — a toast notification appears confirming the pause]`

*"See the toast confirmation — 'Subscription paused successfully' — and the status badge immediately updates to Paused."*

`[Click "Resume" to reactivate it]`

`[Navigate back via sidebar]`

---

### Scene 1.9 — Product Catalog

`[Click "Products" in the sidebar]`

*"The product catalog showcases Stryker's portfolio across all divisions."*

**View Toggle:**

`[Click the grid/list toggle button to switch between views]`

*"We can toggle between grid view — showing product cards with images — and list view for a more compact table format."*

**Division Filter:**

`[Click the Division filter dropdown]`

*"The division filter covers all 11 Stryker divisions: Reconstructive, Spine, Trauma & Extremities, CMF, Endoscopy, Healthcare Systems, Instruments, Medical, Neurovascular, Performance Solutions, and Sustainability Solutions."*

`[Select "Reconstructive" to filter]`

*"Filtering to Reconstructive shows the Triathlon Knee System, Trident II Acetabular, and Mako SmartRobotics System."*

**Search:**

`[Clear the filter and type "LIFEPAK" in the search bar]`

*"Search works across product names and descriptions."*

`[Click on the LIFEPAK 15 product card]`

---

### Scene 1.10 — Product Detail

`[Product detail page loads]`

*"The product detail page shows a large product image, the division badge — Medical in this case — name, description, and price at $28,900."*

**Feature Badges:**

*"Below the price are feature badges indicating product characteristics: Serialized means each unit has a unique serial number for traceability, Batch Managed for lot tracking, Configurable for customizable options, and Subscription Eligible for products that can be set up on recurring delivery."*

**Specifications Table:**

*"The specifications table lists technical details — dimensions, weight, power requirements, certifications, and other product-specific attributes as key-value pairs."*

**Action Buttons:**

*"Three action buttons: **Add to Cart** adds to the shopping cart with a toast confirmation, **Add to Quote** initiates a new quote with this product, and **Report Issue** for flagging product concerns. As a Sales Rep, we see all three."*

`[Click "Add to Cart" — observe the toast notification]`

`[Navigate back via sidebar]`

---

### Scene 1.11 — Consignment Inventory

`[Click "Consignment" in the sidebar]`

*"Consignment inventory tracks Stryker-owned products placed at customer facilities — a key workflow in medical devices. Hospitals have implants and instruments on-site without purchasing them until use."*

*"Each row shows the product, serial or lot number, the facility location, and status: Available means ready for use, Reserved means allocated for a scheduled procedure, and In Use means currently deployed."*

**Request New Consignment:**

`[Click the "Request New" button]`

*"The Request New modal lets us specify the product, quantity, and destination facility. This would trigger a consignment shipment from Stryker's distribution center."*

`[Close the modal]`

**Transfer Consignment:**

`[Click a "Transfer" action button on any row]`

*"Transfer allows moving consignment inventory between facilities — for example, shifting a knee implant set from one hospital to another based on surgical schedules."*

`[Close the modal]`

---

### Scene 1.12 — Assets & Devices

`[Click "Assets & Devices" in the sidebar]`

*"The Assets section tracks serialized capital equipment installed at customer sites — surgical robots, hospital beds, power tool systems, monitors. Each row shows the asset ID, device name, serial number, location, install date, warranty status, and current condition."*

`[Click on AST-001 — Secure II Hospital Bed]`

**Asset Detail:**

*"The detail page shows complete device information: serial number, model, exact location down to the room — ICU Room 312 at Northwest Medical Center. Condition is rated as Good."*

**Warranty Info:**

*"Warranty details show the start and end dates and current status. This bed's warranty runs through 2026 and is Active."*

**Maintenance Schedule:**

*"The maintenance schedule lists upcoming and past service events — preventive maintenance, calibrations, inspections — with dates and status."*

**Transaction History:**

*"Transaction history is a timeline of everything that's happened with this asset — installation, service calls, parts replacements, relocations."*

**Request Service:**

`[Click the "Request Service" button]`

*"The service request modal captures the service type — Corrective Maintenance, Preventive Maintenance, Calibration, Installation, or Software Update — plus priority level: Standard, High, or Critical. A description field captures the issue details. This would generate a service ticket routed to Stryker's field service team."*

`[Close the modal]`

**Compatible Parts:**

*"The 'View Compatible Parts' link navigates to the product catalog pre-filtered to show replacement parts and accessories compatible with this specific device."*

`[Navigate back via sidebar]`

---

### Scene 1.13 — Shipments & Tracking

`[Click "Shipments" in the sidebar]`

*"Shipments provides full logistics visibility. Each row shows the shipment ID, carrier — FedEx, UPS, specialized medical freight — the tracking number displayed in a distinctive monospace teal font, status, and estimated delivery date."*

`[Click on SHP-2025-0001 — In Transit]`

**Shipment Detail:**

*"The detail page has an overview section with carrier, tracking number, service level — like 'White Glove Delivery' for sensitive equipment — and delivery window."*

**Party Cards:**

*"Ship-From and Ship-To cards show the origin warehouse and destination facility with full addresses."*

**Items & Packages:**

*"The items table lists every product in this shipment with serial numbers and lot numbers for full traceability. The packages table shows each physical package with weight, dimensions, and insurance value."*

**Tracking Timeline:**

*"The tracking history timeline shows every scan event: picked up, departed facility, in transit through hub, arrived at destination, out for delivery, delivered — with timestamps for each."*

`[Navigate back via sidebar]`

---

### Scene 1.14 — Returns & RMA

`[Click "Returns & RMA" in the sidebar]`

*"The Returns section manages Return Merchandise Authorization requests. The table shows existing RMAs with their status."*

**Create New RMA:**

`[Click the "New RMA Request" button]`

*"The RMA form captures the original order ID, selects the product being returned, specifies the quantity, and categorizes the return type: Defective, Warranty Claim, Wrong Item Shipped, or Damaged in Transit. A reason text area captures details for the returns team."*

`[Close the modal]`

---

### Scene 1.15 — Documentation & Training

`[Click "Documentation" in the sidebar]`

*"The Documentation library provides downloadable product documents organized by type: Instructions for Use (IFUs), Technical Manuals, Surgical Technique Guides, Marketing Brochures, and Regulatory Certificates. Each card shows the document title, type badge, and a download button."*

`[Click the type filter to show categories, then navigate to Training]`

`[Click "Training" in the sidebar]`

*"Training resources include Videos, E-Learning modules, Certification programs, and Webinars. Each card shows a progress bar indicating completion status — this is especially important for surgical technique certifications. The button text changes contextually: 'Start' for new content, 'Continue' for in-progress modules."*

---

### Scene 1.16 — My Account (Sales Rep View)

`[Click "My Account" in the sidebar]`

*"The Account page shows Emily's profile: name, role as Sales Rep, organization — Stryker Corporation — and her profile details."*

**Territory:**

*"Unique to the Sales Rep role is the **Territory section** showing her assigned region — Pacific Northwest covering Washington, Oregon, Idaho, and Montana — along with her assigned account IDs."*

**Notification Preferences:**

*"Notification preferences let users toggle alerts for different event types — order updates, shipment tracking, quote approvals, and so on."*

---

### Scene 1.17 — Support

`[Click "Support" in the sidebar]`

*"The Support page provides three contact channels: Phone with the support number, Email with the support address, and Live Chat. Below that is an FAQ accordion with expandable answers to common questions."*

---

### Scene 1.18 — Global Search

`[Press Cmd+K (or Ctrl+K on Windows)]`

*"Global search is accessible from anywhere with the keyboard shortcut Cmd+K, or by clicking the search bar in the top navigation."*

*"The command palette searches across four categories simultaneously: Orders, Quotes, Invoices, and Products."*

`[Type "Triathlon" in the search field]`

*"Results are grouped by category, showing up to five matches each. Clicking any result navigates directly to that detail page."*

`[Press Escape to close]`

---

### Scene 1.19 — User Menu & Logout

`[Click the user avatar in the top-right corner]`

*"The user menu dropdown shows the current user's name and organization. 'My Account' links to the profile page, and 'Sign Out' ends the session and returns to the login page."*

`[Click "Sign Out"]`

---

## ACT 2: Hospital Group — Multi-Facility Management

*"Now let's switch to the Hospital Group persona to see how the portal adapts for a health system managing multiple facilities."*

### Scene 2.1 — Login as Hospital Group

`[On the login page, click the "Hospital Group" quick-login button]`

*"We're now Michael Thompson, VP of Supply Chain at Mercy Health System in Cincinnati. He oversees purchasing across three hospital facilities."*

---

### Scene 2.2 — Dashboard Differences

`[Dashboard loads]`

*"The dashboard layout is identical, but the KPI data reflects Mercy Health's activity specifically — their orders, their revenue, their subscriptions."*

*"Michael sees the same four KPI cards as the Sales Rep, including Active Subscriptions. The key difference is perspective: where Emily saw data across all her accounts, Michael sees only Mercy Health's data."*

---

### Scene 2.3 — Navigation Comparison

`[Point to the sidebar]`

*"Notice the sidebar is nearly identical to the Sales Rep view — Michael sees Commerce, Catalog, Inventory & Assets, Logistics, and Account sections. The Hospital Group role has the second-broadest access in the system because large health systems need visibility into every aspect of their Stryker relationship."*

*"The difference isn't what sections are visible — it's the data within them. Michael sees only Mercy Health's orders, invoices, and assets. Emily the Sales Rep could see data across all her assigned accounts."*

---

### Scene 2.4 — My Account (Multi-Facility)

`[Click "My Account" in the sidebar]`

*"Here's where the Hospital Group role really differentiates. Instead of a single location or territory, Michael's account page shows his **facility locations** — three Mercy Health hospitals: Mercy West Hospital, Mercy Fairfield Hospital, and Mercy Anderson Hospital, each with their specific departments like OR suites and ICU wings."*

*"This multi-facility structure drives ship-to address selection when placing orders and determines where consignment inventory and assets are tracked."*

---

### Scene 2.5 — Consignment (Hospital Perspective)

`[Click "Consignment" in the sidebar]`

*"From Michael's perspective, consignment shows what Stryker-owned inventory is on-site at each of his three facilities. He can request new consignment stock and transfer inventory between his hospitals — for example, moving a set of trauma implants from Mercy West to Mercy Anderson for a scheduled surgery."*

*"The Sales Rep saw the same interface but from a supplier perspective — managing consignment across all their customer accounts."*

---

### Scene 2.6 — Orders (Buyer Perspective)

`[Click "Orders" in the sidebar, then click "New Order"]`

*"When Michael creates a new order, he's the **buyer**. The customer field is pre-set to Mercy Health, and the ship-to dropdown shows his registered facilities. This is the opposite side of the same transaction Emily would manage."*

`[Close the form]`

`[Click "Sign Out" from the user menu]`

---

## ACT 3: Distributor — Streamlined Commerce

*"Next, the Distributor persona — a reseller who buys from Stryker and distributes to smaller facilities."*

### Scene 3.1 — Login as Distributor

`[Click the "Distributor" quick-login button]`

*"James Mitchell is Procurement Director at MedEquip Distribution in Chicago. Distributors have a commerce-focused view — they care about orders, pricing, invoices, and logistics."*

---

### Scene 3.2 — Navigation Differences

`[Point to the sidebar]`

*"Compare the sidebar to what we've seen. The Distributor sees Commerce (Orders, Quotes, Invoices), Catalog (Products), and Logistics (Shipments, Returns) — but notice what's **missing**."*

**Key omissions:**
- *"No **Subscriptions** — distributors manage their own reorder cadence"*
- *"No **Consignment** — consignment is a direct manufacturer-to-hospital relationship"*
- *"No **Assets & Devices** — asset tracking is between Stryker and the end-user facility"*
- *"No **Inventory & Assets** section header at all"*

*"The distributor view is intentionally streamlined to the buy-sell-ship workflow."*

---

### Scene 3.3 — My Account (Ship-To Locations)

`[Click "My Account" in the sidebar]`

*"The distributor's account page shows **ship-to locations** — the warehouses where Stryker delivers. James has two: Warehouse East in Newark, New Jersey and Warehouse West in Los Angeles. These appear as shipping options when placing orders."*

*"Compare this to the Hospital Group's facility list or the Sales Rep's territory map — same section, completely different data based on role."*

---

### Scene 3.4 — Products (Add to Cart)

`[Click "Products" in the sidebar, then click on any product]`

*"On the product detail page, the distributor sees **Add to Cart** and **Add to Quote** buttons, just like the Sales Rep. Distributors purchase products for resale, so full cart functionality is available."*

*"Keep this in mind — it will be different for our last role."*

`[Click "Sign Out" from the user menu]`

---

## ACT 4: Medical Professional — Focused Clinical View

*"Finally, the Medical Professional — the most restricted but purposefully focused view."*

### Scene 4.1 — Login as Medical Professional

`[Click the "Medical Professional" quick-login button]`

*"Dr. Sarah Chen is Chief of Orthopedic Surgery at Metro General Hospital in Seattle. She's a clinical end-user — she uses Stryker products in surgery but doesn't manage procurement."*

---

### Scene 4.2 — Navigation (Dramatically Different)

`[Point to the sidebar]`

*"Look at the sidebar now. It's been dramatically simplified. Dr. Chen sees only:"*

- **Dashboard**
- **Products** (under Catalog)
- **Documentation**
- **Training**
- **My Account**
- **Support**

*"That's it. No Orders, no Quotes, no Invoices, no Shipments, no Returns, no Consignment, no Assets. The entire Commerce, Logistics, and Inventory sections are hidden. A surgeon doesn't need to see purchase orders — she needs product information, surgical technique guides, and training certifications."*

---

### Scene 4.3 — Dashboard (Training KPI)

`[Point to the KPI cards on the dashboard]`

*"The dashboard has a subtle but important difference in the KPI cards. The fourth card — which showed 'Active Subscriptions' for every other role — now shows **Training Modules** instead, with the count of available or in-progress training courses. This reflects what matters to a clinician: staying current on technique certifications, not tracking subscription deliveries."*

---

### Scene 4.4 — Products (No Cart)

`[Click "Products" in the sidebar, then click on any product]`

*"Dr. Chen can browse the full product catalog and view all specifications — this is valuable for evaluating devices she might want to use in surgery. But look at the action buttons."*

*"There is **no Add to Cart button**. The medical professional role has view-only catalog access. She can review product details and specifications but cannot initiate purchases. That's the procurement team's job — the Hospital Group or Distributor roles we saw earlier."*

*"She can still Add to Quote and Report Issue — requesting a quote through her facility's procurement workflow, or flagging a product concern."*

---

### Scene 4.5 — Global Search (Filtered)

`[Press Cmd+K]`

*"Even global search is role-filtered. For the Sales Rep, search returned results across Orders, Quotes, Invoices, and Products. For Dr. Chen, search only returns **Product** results — because that's the only transactional data she has access to."*

`[Type "knee" to demonstrate products-only results]`

`[Press Escape]`

---

### Scene 4.6 — Documentation & Training (Clinical Focus)

`[Click "Training" in the sidebar]`

*"Documentation and Training are arguably the most important sections for the medical professional. Surgical technique guides, IFUs, and certification modules directly impact patient outcomes. The progress bars on training cards show where Dr. Chen stands on each required certification."*

*"This same content is available to all roles, but for Dr. Chen it's front-and-center rather than buried below six other navigation sections."*

---

## ACT 5: Wrap-Up & Role Comparison Summary

`[Sign out and return to the login page]`

*"Let me summarize the role-based access model across our four personas."*

| Capability | Medical Professional | Distributor | Hospital Group | Sales Rep |
|:-----------|:-------------------:|:-----------:|:--------------:|:---------:|
| Dashboard | Limited KPIs | Full | Full | Full |
| Orders | — | View + Create | View + Create | View All |
| Quotes | — | View + Create | View + Create | View All + Manage |
| Invoices | — | View + Pay | View + Pay | View All |
| Subscriptions | — | — | View + Manage | View All |
| Products (Browse) | View Only | Add to Cart | Add to Cart | Add to Cart |
| Consignment | — | — | Manage Own | Manage All |
| Assets & Devices | — | — | Manage Own | View All |
| Shipments | — | Track Own | Track Own | Track All |
| Returns/RMA | — | Submit | Submit | View All |
| Documentation | Full | Full | Full | Full |
| Training | Full (featured) | Full | Full | Full |
| Account - Locations | Profile Only | Ship-To Warehouses | Multi-Facility | Territory Map |
| Global Search | Products Only | Full | Full | Full |

*"The design philosophy is progressive disclosure: each role sees exactly what they need, nothing more. A surgeon sees products and training. A distributor sees the buy-ship-pay cycle. A hospital group adds asset and consignment management. And the sales rep gets the complete picture across all their accounts."*

*"Questions?"*

---

## Appendix: Key Demo Data Points

Quick reference for fielding questions about specific records:

| Record | Highlight |
|--------|-----------|
| ORD-2025-0001 | $1.31M Mako SmartRobotics — largest order, Confirmed status |
| ORD-2025-0008 | Draft status — good for showing order lifecycle start |
| QT-2025-0002 | Approved — ready for "Convert to Order" demo |
| INV-2025-0010 | Open, $1.26M — "Pay Now" button visible |
| INV-2024-0008 | Overdue, $6,944 — red status, urgency indicator |
| SUB-001 | Active Monthly — Neptune 3 Canisters, $5,440/delivery |
| SUB-005 | Paused — good for "Resume" demo |
| SHP-2025-0001 | In Transit — full tracking timeline |
| AST-001 | Secure II Bed, ICU Room 312 — warranty + service request demo |
| Mako SmartRobotics | $1.25M flagship product — most expensive in catalog |
| LIFEPAK 15 | $28,900 — good mid-range product with all feature badges |
