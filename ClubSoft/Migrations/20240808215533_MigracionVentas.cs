using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class MigracionVentas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductoTipoProducto");

            migrationBuilder.CreateTable(
                name: "Ventas",
                columns: table => new
                {
                    VentaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonaID = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ventas", x => x.VentaID);
                    table.ForeignKey(
                        name: "FK_Ventas_Personas_PersonaID",
                        column: x => x.PersonaID,
                        principalTable: "Personas",
                        principalColumn: "PersonaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DetalleVentas",
                columns: table => new
                {
                    DetalleVentaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VentaID = table.Column<int>(type: "int", nullable: false),
                    ProductoID = table.Column<int>(type: "int", nullable: false),
                    UsuarioID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cantidad = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SubTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetalleVentas", x => x.DetalleVentaID);
                    table.ForeignKey(
                        name: "FK_DetalleVentas_Productos_ProductoID",
                        column: x => x.ProductoID,
                        principalTable: "Productos",
                        principalColumn: "ProductoID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DetalleVentas_Ventas_VentaID",
                        column: x => x.VentaID,
                        principalTable: "Ventas",
                        principalColumn: "VentaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Productos_TipoProductoID",
                table: "Productos",
                column: "TipoProductoID");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleVentas_ProductoID",
                table: "DetalleVentas",
                column: "ProductoID");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleVentas_VentaID",
                table: "DetalleVentas",
                column: "VentaID");

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_PersonaID",
                table: "Ventas",
                column: "PersonaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_TipoProductos_TipoProductoID",
                table: "Productos",
                column: "TipoProductoID",
                principalTable: "TipoProductos",
                principalColumn: "TipoProductoID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_TipoProductos_TipoProductoID",
                table: "Productos");

            migrationBuilder.DropTable(
                name: "DetalleVentas");

            migrationBuilder.DropTable(
                name: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Productos_TipoProductoID",
                table: "Productos");

            migrationBuilder.CreateTable(
                name: "ProductoTipoProducto",
                columns: table => new
                {
                    ProductosProductoID = table.Column<int>(type: "int", nullable: false),
                    TipoProductoID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductoTipoProducto", x => new { x.ProductosProductoID, x.TipoProductoID });
                    table.ForeignKey(
                        name: "FK_ProductoTipoProducto_Productos_ProductosProductoID",
                        column: x => x.ProductosProductoID,
                        principalTable: "Productos",
                        principalColumn: "ProductoID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductoTipoProducto_TipoProductos_TipoProductoID",
                        column: x => x.TipoProductoID,
                        principalTable: "TipoProductos",
                        principalColumn: "TipoProductoID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductoTipoProducto_TipoProductoID",
                table: "ProductoTipoProducto",
                column: "TipoProductoID");
        }
    }
}
