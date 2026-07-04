

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

- **Responsibility:** Contains the core business entities (`Order`, `OrderItem`, `Client`, `Item`) and business rules.
- **Dependencies:** None.

#### B. Application Layer (`SPIL.SalesOrder.Application`)

- **Responsibility:** Implements business use cases.
- **Components:**
  - `OrderService`
  - Interfaces such as `IOrderRepository` and `IOrderService`
  - DTOs and AutoMapper mappings

#### C. Infrastructure Layer (`SPIL.SalesOrder.Infrastructure`)

- **Responsibility:** Implements persistence and external services.
- **Components:**
  - `ApplicationDbContext`
  - `OrderRepository`
  - Entity Framework Core configuration

#### D. API Layer (`SPIL.SalesOrder.API`)

- **Responsibility:** Exposes REST endpoints.
- **Components:** Thin controllers responsible for request handling, validation, and HTTP responses.

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

## 4. Key Design Patterns Utilized

1. Repository Pattern
2. Dependency Injection (DI)
3. DTO Mapping with AutoMapper
4. Client-side PDF Generation using jsPDF