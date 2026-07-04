# Database Design

This document details the relational database schema for the SPIL Sales Order Management System. The database is implemented using **SQL Server** and managed using **Entity Framework Core Code-First Migrations**.

---

## 🗺️ Entity-Relationship (ER) Diagram

The system relies on a normalized, four-table structure to manage clients, products, and order histories.

```text
+----------------+       1       +----------------+
|    Client      |---------------+     Order      |
+----------------+               +----------------+
| Id (PK)        |               | Id (PK)        |
| CustomerName   |               | ClientId (FK)  |
| Address1       |               | InvoiceNo      |
| Address2       |               | InvoiceDate    |
| Suburb         |               | ReferenceNo    |
| State          |               | Note           |
| PostCode       |               | TotalExcl      |
|                |               | TotalTax       |
+----------------+               | TotalIncl      |
                                 +----------------+
                                         | 1
                                         |
+----------------+       1               | Many
|     Item       |---------------+       |
+----------------+               | +----------------+
| Id (PK)        |               +-|   OrderItem    |
| ItemCode       |                 +----------------+
| Description    |                 | Id (PK)        |
| DefaultPrice   |                 | OrderId (FK)   |
| DefaultTaxRate |                 | ItemId (FK)    |
+----------------+                 | Quantity       |
                                   | Price          |
                                   | TaxRate        |
                                   | Note           |
                                   +----------------+
```

All relationships are enforced through foreign key constraints managed by Entity Framework Core and SQL Server.

## 🗄️ Table Definitions

### 1. Client

Stores the master records for all customers.

- **Id (PK):** Primary identity key.
- **CustomerName:** The display name of the client.
- **Address1, Address2, Suburb, State, PostCode:** Address information used to populate the Sales Order form when a client is selected.

### 2. Item

Stores the master product catalog.

- **Id (PK):** Primary identity key.
- **ItemCode:** Unique alphanumeric identifier (for example, `ITM-001`).
- **Description:** Product display name.
- **DefaultPrice:** Current default selling price.
- **DefaultTaxRate:** Current default tax percentage.

### 3. Order

Represents a finalized sales order.

- **Id (PK):** Primary identity key.
- **ClientId (FK):** References the associated client.
- **InvoiceNo:** Unique invoice number.
- **InvoiceDate:** Date the invoice was created.
- **ReferenceNo:** Optional external purchase order or reference number.
- **Note:** Optional order notes.
- **TotalExcl, TotalTax, TotalIncl:** Financial totals calculated by the backend before the order is persisted. Client-supplied totals are ignored to ensure data integrity.

### 4. OrderItem

Associative entity linking orders and items while preserving line-item details.

- **Id (PK):** Primary identity key.
- **OrderId (FK):** References the parent order.
- **ItemId (FK):** References the purchased item.
- **Quantity:** Number of units ordered.
- **Note:** Optional line-item notes.
- **Price (Snapshot):** The price charged at the time of purchase. This value is copied from `Item.DefaultPrice` so historical invoices remain accurate even if the item's default price changes later.
- **TaxRate (Snapshot):** The tax rate applied at the time of purchase.


## Entity Relationships

Entity Framework Core navigation properties are used to model relationships between entities.

Examples include:

- One **Client** → Many **Orders**
- One **Order** → Many **OrderItems**
- One **Item** → Many **OrderItems**

---

## 🌱 Database Seeding

To simplify evaluation of this technical assessment, `ApplicationDbContext.cs` uses Entity Framework Core's `HasData` method to seed reference data automatically.

After applying the initial migration, the database is pre-populated with:

- Sample **Client** records, including complete address information.
- Sample **Item** records, including default prices and tax rates.

This allows the `GET /Clients` and `GET /Items` endpoints to return data immediately, enabling the frontend dropdowns to function without requiring manual setup of master data.