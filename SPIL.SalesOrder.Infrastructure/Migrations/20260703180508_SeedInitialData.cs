using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SPIL.SalesOrder.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Clients",
                columns: new[] { "Id", "Address1", "Address2", "Address3", "CustomerName", "PostCode", "State", "Suburb" },
                values: new object[,]
                {
                    { 1, "No 15, loka mawatha", null, null, "Kasun Sampath", "00100", "WP", "Colombo" },
                    { 2, "No 13, bank's road", null, null, "Nimal Perera", "10200", "WP", "Kirulapana" },
                    { 3, "No 37/2, water park", null, null, "Tim Cook", "20000", "WP", "Nugegoda" }
                });

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "Id", "DefaultPrice", "DefaultTaxRate", "Description", "ItemCode" },
                values: new object[,]
                {
                    { 1, 150000.00m, 15.00m, "Enterprise Server Rack", "ITM-001" },
                    { 2, 12000.00m, 10.00m, "Mechanical Keyboard", "ITM-002" },
                    { 3, 4500.00m, 10.00m, "Wireless Mouse", "ITM-003" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
