# SPIL Labs - Sales Order Management System

## Overview
This is a full-stack web application developed for the SPIL Labs Intern Software Engineer technical assessment. It handles creating, calculating, and managing Sales Orders.

## Architecture
The application strictly follows **Clean Architecture** principles to ensure separation of concerns:
*   **Domain:** Contains the core enterprise entities (`Client`, `Item`, `Order`).
*   **Application:** Houses business logic, interfaces, and DTO mappings.
*   **Infrastructure:** Manages data access via Entity Framework Core and SQL Server.
*   **API:** .NET 8 Web API serving as the entry point and coordinator.
*   **Frontend:** React (Vite) utilizing Redux Toolkit and Tailwind CSS.

## Setup Instructions (macOS / Docker)
### 1. Database Setup
This project uses Azure SQL Edge via Docker for macOS compatibility.
\`\`\`bash
docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=SuperSecretPass123!' -p 1433:1433 --name spil-sql -d mcr.microsoft.com/azure-sql-edge
\`\`\`