using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class CrearTablas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cobros",
                columns: table => new
                {
                    CobroID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PedidoID = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Importe = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cobros", x => x.CobroID);
                });

            migrationBuilder.CreateTable(
                name: "Facturas",
                columns: table => new
                {
                    FacturaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonaID = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Importe = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Facturas", x => x.FacturaID);
                });

            migrationBuilder.CreateTable(
                name: "Provincias",
                columns: table => new
                {
                    ProvinciaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provincias", x => x.ProvinciaID);
                });

            migrationBuilder.CreateTable(
                name: "DetalleFacturas",
                columns: table => new
                {
                    DetalleFacturaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FacturaID = table.Column<int>(type: "int", nullable: false),
                    Detalle = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetalleFacturas", x => x.DetalleFacturaID);
                    table.ForeignKey(
                        name: "FK_DetalleFacturas_Facturas_FacturaID",
                        column: x => x.FacturaID,
                        principalTable: "Facturas",
                        principalColumn: "FacturaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Localidades",
                columns: table => new
                {
                    LocalidadID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProvinciaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localidades", x => x.LocalidadID);
                    table.ForeignKey(
                        name: "FK_Localidades_Provincias_ProvinciaID",
                        column: x => x.ProvinciaID,
                        principalTable: "Provincias",
                        principalColumn: "ProvinciaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Personas",
                columns: table => new
                {
                    PersonaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Apellido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DNI = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LocalidadID = table.Column<int>(type: "int", nullable: false),
                    UsuarioID = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personas", x => x.PersonaID);
                    table.ForeignKey(
                        name: "FK_Personas_Localidades_LocalidadID",
                        column: x => x.LocalidadID,
                        principalTable: "Localidades",
                        principalColumn: "LocalidadID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CuentaCorrientes",
                columns: table => new
                {
                    CuentaCorrienteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonaID = table.Column<int>(type: "int", nullable: false),
                    CobroID = table.Column<int>(type: "int", nullable: false),
                    FacturaID = table.Column<int>(type: "int", nullable: false),
                    Saldo = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Ingreso = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Egreso = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuentaCorrientes", x => x.CuentaCorrienteID);
                    table.ForeignKey(
                        name: "FK_CuentaCorrientes_Cobros_CobroID",
                        column: x => x.CobroID,
                        principalTable: "Cobros",
                        principalColumn: "CobroID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CuentaCorrientes_Facturas_FacturaID",
                        column: x => x.FacturaID,
                        principalTable: "Facturas",
                        principalColumn: "FacturaID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CuentaCorrientes_Personas_PersonaID",
                        column: x => x.PersonaID,
                        principalTable: "Personas",
                        principalColumn: "PersonaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CuentaCorrientes_CobroID",
                table: "CuentaCorrientes",
                column: "CobroID");

            migrationBuilder.CreateIndex(
                name: "IX_CuentaCorrientes_FacturaID",
                table: "CuentaCorrientes",
                column: "FacturaID");

            migrationBuilder.CreateIndex(
                name: "IX_CuentaCorrientes_PersonaID",
                table: "CuentaCorrientes",
                column: "PersonaID");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFacturas_FacturaID",
                table: "DetalleFacturas",
                column: "FacturaID");

            migrationBuilder.CreateIndex(
                name: "IX_Localidades_ProvinciaID",
                table: "Localidades",
                column: "ProvinciaID");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_LocalidadID",
                table: "Personas",
                column: "LocalidadID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CuentaCorrientes");

            migrationBuilder.DropTable(
                name: "DetalleFacturas");

            migrationBuilder.DropTable(
                name: "Cobros");

            migrationBuilder.DropTable(
                name: "Personas");

            migrationBuilder.DropTable(
                name: "Facturas");

            migrationBuilder.DropTable(
                name: "Localidades");

            migrationBuilder.DropTable(
                name: "Provincias");
        }
    }
}
