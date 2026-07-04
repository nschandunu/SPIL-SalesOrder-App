# SPIL Sales Order Management System

## Project Overview
The SPIL Sales Order Management System is a full-stack web application designed to streamline the creation, management, and export of sales orders. Developed as a technical assessment for SPIL Labs, it features a responsive React frontend and a robust, Clean Architecture .NET 8 Web API backend.

The application allows users to browse existing orders, create new orders with dynamic line-item calculations (exclusive amounts, tax, and inclusive totals), and export finalized invoices as professional PDFs.

---

## 📸 Screenshots
- **[Home Dashboard]** - `![Home Dashboard](docs/assets/home.png)`
- **[Sales Order Form]** - `![Sales Order Form](docs/assets/sales-order.png)`
- **[PDF Export Preview]** - `![PDF Export](docs/assets/pdf-export.png)`

---

## 🚀 Tech Stack

### Frontend
- **React (Vite):** Functional components and Hooks.
- **Redux Toolkit:** Centralized state management for order lists.
- **React Router DOM:** Client-side navigation.
- **Tailwind CSS:** Utility-first styling and responsive layouts.
- **Axios:** API communication.
- **jsPDF & AutoTable:** Client-side PDF invoice generation.

### Backend
- **.NET 8 Web API:** Core backend framework.
- **Entity Framework Core:** Code-First ORM.
- **SQL Server:** Relational database.
- **AutoMapper:** Entity-to-DTO object mapping.

---

## 🏗️ Architecture Overview
This project strictly enforces **Separation of Concerns**.
- The frontend utilizes a component-driven architecture with isolated services and utility functions.
- The backend follows **Clean Architecture**, ensuring that API controllers remain thin, database interactions are abstracted via the Repository Pattern, and all business rules are isolated in the Application layer.

📖 **Read the full system design in [ARCHITECTURE.md](docs/ARCHITECTURE.md)**

---

## ✨ Key Features
- **Dynamic Form Handling:** Auto-populating customer details and product descriptions based on database selections.
- **Real-Time Calculations:** Client-side and server-side calculation of line item totals and taxes.
- **Enterprise UI:** Custom, reusable Tailwind UI components (Buttons, Inputs, Selects, Tables) reflecting a consistent design system.
- **PDF Export:** One-click generation of A4-formatted, professional invoice PDFs.
- **Robust Data Handling:** DTOs prevent over-posting and ensure secure data transfer.

---

## 📂 Project Structure

```text
SPIL-SALESORDER-APP/
│
├── docs/                             # Extended Technical Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── DECISIONS.md
│
├── frontend/                         # React + Vite UI Application
│
├── SPIL.SalesOrder.API/              # Presentation Layer (Controllers)
├── SPIL.SalesOrder.Application/      # Business Logic (Services, DTOs, Interfaces)
├── SPIL.SalesOrder.Domain/           # Core Entities & Enums
├── SPIL.SalesOrder.Infrastructure/   # Data Access (EF Core, Repositories)
│
├── SPIL.SalesOrder.sln               # .NET Solution File
└── README.md                         # Main entry point
```

---

## 🛠️ Getting Started

To run this project locally, you will need **Node.js**, **.NET 8 SDK**, and a running instance of **SQL Server**.

📖 **Follow the step-by-step installation guide in [SETUP.md](docs/SETUP.md)**

---

## 🔌 API & Database Reference

- **API Endpoints:** View the documented REST endpoints, request structures, and status codes in [API.md](docs/API.md).
- **Database Design:** View the Entity-Relationship structure and normalization strategy in [DATABASE.md](docs/DATABASE.md).

---

## 💡 Assumptions & Constraints

- **Seeded Data:** The application automatically seeds Clients and Items during database initialization. This keeps the assessment focused on the Sales Order workflow while allowing for immediate testing.
- **Order Updates:** For the scope of this project, editing an order's line items utilizes a collection replacement strategy.

📖 **Read the full context on these trade-offs in [DECISIONS.md](docs/DECISIONS.md)**

---

## 🔮 Future Improvements

If this project were to be scaled into a production ERP environment, the following enhancements would be prioritized:

- **Authentication & Authorization:** Implement JWT-based identity management with Role-Based Access Control (RBAC).
- **Pagination & Filtering:** Apply server-side pagination for the Home screen data grid to handle thousands of orders.
- **Differential Graph Updates:** Upgrade the line-item update logic to track primary keys on the frontend, allowing for granular database updates (Add/Modify/Remove) to preserve audit histories.
- **CI/CD Pipeline:** Containerize both applications using Docker and set up automated testing via GitHub Actions.

---

## 📌 Notes

Developed for the **SPIL Labs Technical Assessment**.