# SPIL Labs - Sales Order Management System

## Overview
This is a full-stack web application developed for the SPIL Labs Intern Software Engineer technical assessment. The system handles the creation, calculation, and management of Sales Orders, strictly enforcing data integrity and professional architectural standards.

**Author:** Senuka Chandunu

## Architecture
The backend strictly adheres to **Clean Architecture** (N-Tier) principles to ensure maximum separation of concerns, testability, and scalability:
* **Domain:** Contains the core enterprise entities (`Client`, `Item`, `Order`, `OrderItem`).
* **Application:** Houses the business logic (`OrderService`), interfaces, and DTO mappings via AutoMapper.
* **Infrastructure:** Manages data access via the Repository Pattern and Entity Framework Core.
* **API:** .NET 8 Web API serving as the entry point, utilizing thin controllers and Dependency Injection.
* **Frontend:** React (Vite) utilizing Redux Toolkit and Tailwind CSS (Scaffolded and in development).

## Engineering Decisions & Best Practices
* **Server-Side Source of Truth:** The backend does not trust frontend math. All line-item totals (`ExclAmount`, `TaxAmount`, `InclAmount`) and order totals (`TotalExcl`, `TotalTax`, `TotalIncl`) are strictly calculated within the `OrderService` before saving to the database.
* **Entity Framework Graph Saving:** Complex parent-child database transactions (saving an Order and multiple OrderItems) are handled cleanly using EF Core's graph saving capabilities.
* **DTO Isolation:** Raw database entities are never exposed to the frontend. Data is mapped to specific Input/Output DTOs using AutoMapper.
* **Data Validation:** `[Required]` and `[Range]` data annotations are used on Input DTOs to intercept bad requests before they reach the service layer.
* **Database Seeding:** The `ApplicationDbContext` is configured to automatically seed the `Clients` and `Items` tables with sample data upon migration.

## Tech Stack
### Backend
* .NET 8.0 Web API
* C#
* Entity Framework Core (Code-First)
* Microsoft SQL Server (Azure SQL Edge for macOS)
* AutoMapper

### Frontend (In Progress)
* React (Functional Components & Hooks) via Vite
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

---

## Local Setup Instructions (macOS Environment)

### 1. Database Setup (Docker)
This project uses Azure SQL Edge via Docker for Apple Silicon compatibility. Run the following command to spin up the database container:

```bash
docker run --cap-add SYS_PTRACE \
  -e 'ACCEPT_EULA=1' \
  -e 'MSSQL_SA_PASSWORD=SuperSecretPass123!' \
  -p 1433:1433 \
  --name spil-sql \
  -d mcr.microsoft.com/azure-sql-edge
```

### 2. Backend Initialization
Navigate to the project root directory and apply the Entity Framework Core migrations to create the database schema and seed the initial data:

```bash
dotnet ef database update --project SPIL.SalesOrder.Infrastructure --startup-project SPIL.SalesOrder.API
```

### 3. Run the API
Start the .NET Web API:

```bash
dotnet run --project SPIL.SalesOrder.API
```

Once the API is running, open the Swagger UI in your browser:

```text
http://localhost:5191/swagger
```
