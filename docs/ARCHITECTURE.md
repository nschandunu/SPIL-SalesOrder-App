# System Architecture

This document outlines the architectural decisions and structural design of the SPIL Sales Order Management System. The application is divided into a decoupled React single-page application (SPA) and a .NET 8 Web API, communicating via REST.

---

## 1. High-Level System Design

```text
[ React Frontend ]  <--(JSON / REST)-->  [ .NET 8 Web API ]  <--(EF Core)-->  [ SQL Server ]
```

The system is designed with strict boundaries:

- The **Frontend** handles all UI state, rendering, and client-side validation.
- The **Backend** acts as the definitive source of truth, enforcing business rules, calculating financial totals securely, and managing data persistence.

---

## 2. Backend: Clean Architecture

The backend follows **Clean Architecture**, separating responsibilities into four projects and applying the Dependency Inversion Principle. Dependencies point inward toward the Domain layer.

### Architecture Diagram

```text
      (Core)
      SPIL.SalesOrder.Domain
             ▲
             │
      SPIL.SalesOrder.Application (Services, DTOs, Interfaces)
             ▲                      ▲
             │                      │
(Presentation)                      (Data Access)
SPIL.SalesOrder.API          SPIL.SalesOrder.Infrastructure
```

### Layer Breakdown

#### A. Domain Layer (`SPIL.SalesOrder.Domain`)

- **Responsibility:** Contains the core business entities (`Order`, `OrderItem`, `Client`, `Item`) that represent the business domain.
- **Dependencies:** None.

#### B. Application Layer (`SPIL.SalesOrder.Application`)

- **Responsibility:** Implements application use cases, business rules, validation, financial calculations, and coordination between the API and data access layers.
- **Components:**
  - `OrderService`
  - Interfaces such as `IOrderRepository` and `IOrderService`
  - DTOs and AutoMapper mappings

#### C. Infrastructure Layer (`SPIL.SalesOrder.Infrastructure`)

- **Responsibility:** Implements persistence and external services.
- **Components:**
  - `ApplicationDbContext`
  - `OrderRepository`
  - `Entity Framework Core`
  - `SQL Server persistence`
  - `Database migrations and seed data`

#### D. API Layer (`SPIL.SalesOrder.API`)

- **Responsibility:** Exposes REST endpoints.
- **Components:** Thin controllers responsible for routing, model validation, invoking application services, and returning HTTP responses.

---

## 3. Frontend Architecture (React)

The frontend uses a modular, feature-based structure for maintainability and reusability.

### Data Flow & State Management

- **Redux Toolkit:** Stores shared application state.
- **Local State (`useState`):** Manages page-specific and form-specific state.

### Separation of Concerns

- `/components` – Reusable UI components.
- `/pages` – Route-level views.
- `/services` – API communication using Axios.
- `/utils` – Pure utility functions.
- `/hooks` – Custom React hooks.

---

## 4. Request Flow

```text
React Component
        │
        ▼
Axios Service
        │
        ▼
API Controller
        │
        ▼
Application Service
        │
        ▼
Repository
        │
        ▼
Entity Framework Core
        │
        ▼
SQL Server
```

Responses travel back through the same layers before being rendered by the React UI.

---

## 5. Business Logic

Financial calculations are implemented within the Application layer.

Although the frontend performs live calculations to improve user experience, the backend recalculates all order totals before persisting data to ensure data integrity and prevent client-side manipulation.

---

## 6. Database Initialization

The application automatically seeds sample **Clients** and **Items** during database initialization.

This enables reviewers to immediately test the Sales Order workflow without first creating master data.

---

## 7. Key Design Patterns Utilized

1. Repository Pattern
2. Dependency Injection (DI)
3. DTO Mapping with AutoMapper
4. Client-side PDF Generation using jsPDF