using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class ModificacionVentasYCobros : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_CuentaCorrientes_CuentaCorrienteID",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_CuentaCorrienteID",
                table: "Ventas");

            migrationBuilder.RenameColumn(
                name: "CuentaCorrienteID",
                table: "Ventas",
                newName: "PersonaID");

            migrationBuilder.AlterColumn<int>(
                name: "Estado",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsuarioID",
                table: "Ventas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CobroID",
                table: "CuentaCorrientes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VentaID",
                table: "CuentaCorrientes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Cobros",
                columns: table => new
                {
                    CobroID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PersonaID = table.Column<int>(type: "int", nullable: false),
                    EstadoCobro = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UsuarioID = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cobros", x => x.CobroID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SocioTitulares_PersonaID",
                table: "SocioTitulares",
                column: "PersonaID");

            migrationBuilder.CreateIndex(
                name: "IX_CuentaCorrientes_CobroID",
                table: "CuentaCorrientes",
                column: "CobroID");

            migrationBuilder.CreateIndex(
                name: "IX_CuentaCorrientes_VentaID",
                table: "CuentaCorrientes",
                column: "VentaID");

            migrationBuilder.AddForeignKey(
                name: "FK_CuentaCorrientes_Cobros_CobroID",
                table: "CuentaCorrientes",
                column: "CobroID",
                principalTable: "Cobros",
                principalColumn: "CobroID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CuentaCorrientes_Ventas_VentaID",
                table: "CuentaCorrientes",
                column: "VentaID",
                principalTable: "Ventas",
                principalColumn: "VentaID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SocioTitulares_Personas_PersonaID",
                table: "SocioTitulares",
                column: "PersonaID",
                principalTable: "Personas",
                principalColumn: "PersonaID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CuentaCorrientes_Cobros_CobroID",
                table: "CuentaCorrientes");

            migrationBuilder.DropForeignKey(
                name: "FK_CuentaCorrientes_Ventas_VentaID",
                table: "CuentaCorrientes");

            migrationBuilder.DropForeignKey(
                name: "FK_SocioTitulares_Personas_PersonaID",
                table: "SocioTitulares");

            migrationBuilder.DropTable(
                name: "Cobros");

            migrationBuilder.DropIndex(
                name: "IX_SocioTitulares_PersonaID",
                table: "SocioTitulares");

            migrationBuilder.DropIndex(
                name: "IX_CuentaCorrientes_CobroID",
                table: "CuentaCorrientes");

            migrationBuilder.DropIndex(
                name: "IX_CuentaCorrientes_VentaID",
                table: "CuentaCorrientes");

            migrationBuilder.DropColumn(
                name: "UsuarioID",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "CobroID",
                table: "CuentaCorrientes");

            migrationBuilder.DropColumn(
                name: "VentaID",
                table: "CuentaCorrientes");

            migrationBuilder.RenameColumn(
                name: "PersonaID",
                table: "Ventas",
                newName: "CuentaCorrienteID");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Ventas",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_CuentaCorrienteID",
                table: "Ventas",
                column: "CuentaCorrienteID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_CuentaCorrientes_CuentaCorrienteID",
                table: "Ventas",
                column: "CuentaCorrienteID",
                principalTable: "CuentaCorrientes",
                principalColumn: "CuentaCorrienteID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
