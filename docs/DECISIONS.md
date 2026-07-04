# Architectural & Design Decisions

This document outlines the core technical justifications, design patterns, and architectural trade-offs chosen during the development of the Sales Order Management System.

---

## 🏛️ 1. Architecture Style: Clean Architecture

To satisfy the clean separation of concerns required by the assessment guidelines, a **Clean Architecture** approach was adopted, separating responsibilities across independent layers with inward dependencies.

* **API Layer (`SPIL.SalesOrder.API`):** Acts strictly as the entry point. It manages request routing, model validation, and delegation to the Application layer. It contains no business logic or direct database queries.
* **Application Layer (`SPIL.SalesOrder.Application`):** Encapsulates application use cases, business rules, transaction orchestration, and financial calculations (Excl, Tax, and Incl totals).
* **Infrastructure / Data Layer (`SPIL.SalesOrder.Infrastructure`):** Houses the Entity Framework Core `DbContext`, database migrations, and seeded reference data configurations.
* **Domain Layer (`SPIL.SalesOrder.Domain`):** Defines the core database entities (`Client`, `Item`, `Order`, `OrderItem`) and contract interfaces, completely decoupled from external frameworks.

**Justification:** This structure ensures that changes to the database provider or the API/frontend layers do not affect the core business rules, facilitating easier automated unit testing and long-term codebase maintainability.

---

## 🔒 2. Server-Side Financial Calculation (Zero-Trust Frontend)

A critical architectural constraint enforced in this implementation is that **all financial arithmetic occurs exclusively on the backend**. 

* While the React frontend performs instantaneous calculations (e.g., `Quantity * Price`) to provide a highly responsive user experience, the backend completely discards any totals sent in the request payload.
* Upon receiving a `POST` or `PUT` request, the Application Layer uses the submitted item pricing information and recalculates all line-item and order totals before persistence.

$$\text{Excl Amount} = \text{Quantity} \times \text{Price}$$
$$\text{Tax Amount} = \text{Excl Amount} \times \frac{\text{Tax Rate}}{100}$$
$$\text{Incl Amount} = \text{Excl Amount} + \text{Tax Amount}$$

**Justification:** This eliminates vulnerability to client-side payload tampering, ensuring that malicious or malformed network requests cannot force incorrect financial data into the database ledger.

---

## 🔄 3. Update Strategy: Child-Collection Replacement

Managing updates (`PUT`) on an aggregate root containing dependent child collections (`Order` $\rightarrow$ `OrderItems`) presents a classic database challenge: syncing modified rows, inserting new rows, and tracking deleted rows.

* For the scope of this technical assessment, a **Collection Replacement Strategy** was implemented.
* When an order is updated, the existing child collection is replaced with the items supplied in the request. This trade-off was intentionally chosen for the scope of the technical assessment.

**Justification:** This pattern drastically reduces database transaction complexity and prevents unintended orphaned records, ensuring a highly predictable and clean state reset within the constrained assessment timeline.

---

## 🚚 4. Decoupled Dynamic Address Strategy

During requirement analysis of Screen 1, it was noted that while selecting a client auto-populates the shipping address fields, the instructions state: *"These fields can be filled (type) by user as wish."*

* **Decision:** Address fields (`Address1`, `Address2`, `Suburb`, `State`, `PostCode`) were explicitly designed as attributes of the `Order` entity rather than reading dynamically from the `Client` relationship during runtime.
* When a user alters an address on a specific order, it updates that transactional invoice instance without mutating the master `Client` record.

**Justification:** This accurately mirrors real-world ERP systems where a customer might request delivery to a temporary site or alternative warehouse without changing their corporate billing headquarters.

---

## 🌐 5. State Management & Dropdown Optimization

On the React frontend, populating a dynamic data grid with cross-referenced dropdown menus (`ItemCode` and `Description` sync) can introduce heavy rendering overhead.

* **Decision:** The application fetches master reference catalogs (`Clients` and `Items`) exactly once when the component mounts and caches them in local component state.
* Grid rows perform in-memory lookups against the cached reference data to instantly resolve and cross-populate information (for example, selecting an Item Code immediately displays the corresponding Description and default pricing information).

**Justification:** This minimizes redundant HTTP round-trips to the backend API, drastically lowering network traffic and keeping UI interactions exceptionally fluid.

---

## 📚 6. Documentation Strategy

To improve maintainability and simplify project evaluation, the repository includes dedicated documentation covering different aspects of the system:

- **README.md** – Project overview, features, technology stack, and quick start guide.
- **ARCHITECTURE.md** – Clean Architecture design, request flow, and project structure.
- **API.md** – REST API endpoints, validation rules, business rules, and request/response examples.
- **DATABASE.md** – Database schema, entity relationships, and persistence strategy.
- **SETUP.md** – Local development environment and installation instructions.
- **DECISIONS.md** – Architectural decisions, implementation trade-offs, and design rationale.

This separation keeps each document focused on a single concern, making the project easier to understand, maintain, and review.