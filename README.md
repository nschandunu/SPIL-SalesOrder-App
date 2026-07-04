# SPIL Labs - Sales Order Management System

## 🚀 Overview
This is a full-stack web application developed for the SPIL Labs Intern Software Engineer technical assessment. The system handles the creation, management, and calculation of Sales Orders, strictly enforcing data integrity and professional architectural standards.

**Author:** Senuka Chandunu  
**Time Spent:** ~48 Hours

---

## 🏗️ Architecture & Engineering Decisions

### The Backend: Clean Architecture (N-Tier)
The API strictly adheres to Clean Architecture principles to ensure maximum separation of concerns, testability, and scalability:
* **Domain Layer:** Contains the core enterprise entities (`Client`, `Item`, `Order`, `OrderItem`).
* **Application Layer:** Houses the business logic (`OrderService`), interfaces, and DTO mappings via AutoMapper.
* **Infrastructure Layer:** Manages data access via the Repository Pattern and Entity Framework Core.
* **API Layer:** .NET 8 Web API serving as the entry point, utilizing thin controllers and Dependency Injection.

### Key Backend Features
* **Server-Side Source of Truth:** The backend does not trust frontend math. All line-item totals (`ExclAmount`, `TaxAmount`, `InclAmount`) and order totals (`TotalExcl`, `TotalTax`, `TotalIncl`) are strictly calculated within the `OrderService` before saving to the database.
* **Entity Framework Graph Saving:** Complex parent-child database transactions (saving an Order and multiple OrderItems) are handled cleanly using EF Core's graph saving capabilities.
* **DTO Isolation:** Raw database entities are never exposed to the frontend. Data is mapped to specific Input/Output DTOs using AutoMapper.
* **Data Validation:** `[Required]` and `[Range]` data annotations are used on Input DTOs to intercept bad requests before they reach the service layer.
* **Database Seeding:** The `ApplicationDbContext` is configured to automatically seed the `Clients` and `Items` tables with sample data upon migration.

### The Frontend: React + Redux
* **Framework:** Scaffolded with Vite using React Functional Components & Hooks (strictly following assessment requirements).
* **State Management:** Redux Toolkit handles global state (e.g., fetching and caching the order list).
* **Styling:** Tailwind CSS v4 for rapid, responsive, and custom UI development without heavy external component libraries.
* **Routing:** React Router handles navigation, including the requested double-click-to-edit feature.

---

## 🛠️ Tech Stack

**Backend**
* .NET 8.0 Web API
* C#
* Entity Framework Core (Code-First)
* Microsoft SQL Server (Azure SQL Edge for macOS compatibility)
* AutoMapper

**Frontend**
* React (Vite)
* Redux Toolkit
* React Router DOM
* Tailwind CSS v4
* Axios

---

## ⚙️ Local Setup Instructions

### Prerequisites
* .NET 8 SDK
* Node.js (v18+)
* Docker (for the SQL Server instance)

### 1. Database Setup (Docker)
This project uses Azure SQL Edge via Docker for Apple Silicon / cross-platform compatibility. Run the following command to spin up the database container:
```bash
docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=SuperSecretPass123!' -p 1433:1433 --name spil-sql -d [mcr.microsoft.com/azure-sql-edge](https://mcr.microsoft.com/azure-sql-edge)
```

### 2. Backend Initialization
Navigate to the project root directory and apply the Entity Framework Core migrations to create the database schema and seed the initial data:

```bash
dotnet ef database update --project SPIL.SalesOrder.Infrastructure --startup-project SPIL.SalesOrder.API
```

Start the .NET API:

```bash
dotnet run --project SPIL.SalesOrder.API
```

The API will typically be available at `http://localhost:5191`. You can access the Swagger UI by visiting `http://localhost:5191/swagger`.

### 3. Frontend Initialization
Open a new terminal, navigate to the frontend directory, install the dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

The React application will typically be available at `http://localhost:5173`. CORS is already configured on the backend to allow requests from this origin.

## Seed Data

The application seeds Clients and Items during database initialization to simplify testing and demonstrate the Sales Order workflow without requiring separate master-data management screens.