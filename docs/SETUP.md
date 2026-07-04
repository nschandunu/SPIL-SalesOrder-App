# Local Setup & Installation

This guide describes the steps required to run the SPIL Sales Order Management System in a local development environment.

## 📋 Prerequisites

Ensure you have the following installed before proceeding:
* **.NET 8.0 SDK**
* **Node.js** (v18 or higher recommended)
* **SQL Server** (or Azure SQL Edge / Docker equivalent)

---

## ⚙️ 1. Database Configuration

Before starting the backend, ensure the database connection string is pointing to your local SQL Server instance.

1. Navigate to the API project folder: `backend/SPIL.SalesOrder.API`
2. Open `appsettings.json` (or `appsettings.Development.json`).
3. Update the `DefaultConnection` string to match your SQL Server credentials:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=SpilSalesOrderDb;User Id=sa;Password=YourStrongPassword123!;TrustServerCertificate=True;"
}
```

---

## 🖥️ 2. Backend Setup (.NET 8)

The backend uses Entity Framework Core to automatically generate the database schema and seed the initial master data.

Open a terminal at the root of the **backend solution folder** and run the following commands:

**1. Restore NuGet packages:**

```bash
dotnet restore
```

**2. Apply Entity Framework Core Migrations:**

*This command creates the database (if it does not already exist), applies all pending Entity Framework Core migrations, and seeds the sample Clients and Items required by the application.*

```bash
dotnet ef database update --project SPIL.SalesOrder.Infrastructure --startup-project SPIL.SalesOrder.API
```

**3. Run the API:**

```bash
dotnet run --project SPIL.SalesOrder.API
```

*The API will start on the URL configured by the ASP.NET Core launch profile. After the application starts, navigate to `/swagger` to access the interactive OpenAPI documentation and verify the backend is running correctly.*

---

## 🎨 3. Frontend Setup (React + Vite)

Open a **new terminal window** and navigate to the **frontend folder**:

**1. Install npm dependencies:**

```bash
npm install
```

**2. Configure the API Base URL (Optional):**

By default, the Axios service points to standard localhost ports. If your .NET API launched on a different port, create a `.env` file in the frontend root and set the base URL (e.g., `VITE_API_URL=https://localhost:7123/api`).

**3. Start the Vite Development Server:**

```bash
npm run dev
```

*The terminal will output a local address (e.g., `http://localhost:5173`). Open this link in your browser to interact with the SPIL Sales Order Management System.*

---

## ✅ Verify the Installation

After completing the setup:

- The backend starts successfully without errors.
- Swagger is accessible at `/swagger`.
- The frontend loads in the browser.
- Sample Clients and Items appear in the Sales Order form.
- Creating and updating a Sales Order completes successfully.