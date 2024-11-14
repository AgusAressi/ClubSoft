using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class ModificacionTablaCuentaCorriente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CuentaCorrientes_Cobros_CobroID",
                table: "CuentaCorrientes");

            migrationBuilder.DropForeignKey(
                name: "FK_CuentaCorrientes_Ventas_VentaID",
                table: "CuentaCorrientes");

            migrationBuilder.AlterColumn<int>(
                name: "VentaID",
                table: "CuentaCorrientes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CobroID",
                table: "CuentaCorrientes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_PersonaID",
                table: "Ventas",
                column: "PersonaID");

            migrationBuilder.CreateIndex(
                name: "IX_Cobros_PersonaID",
                table: "Cobros",
                column: "PersonaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Cobros_Personas_PersonaID",
                table: "Cobros",
                column: "PersonaID",
                principalTable: "Personas",
                principalColumn: "PersonaID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CuentaCorrientes_Cobros_CobroID",
                table: "CuentaCorrientes",
                column: "CobroID",
                principalTable: "Cobros",
                principalColumn: "CobroID");

            migrationBuilder.AddForeignKey(
                name: "FK_CuentaCorrientes_Ventas_VentaID",
                table: "CuentaCorrientes",
                column: "VentaID",
                principalTable: "Ventas",
                principalColumn: "VentaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Personas_PersonaID",
                table: "Ventas",
                column: "PersonaID",
                principalTable: "Personas",
                principalColumn: "PersonaID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cobros_Personas_PersonaID",
                table: "Cobros");

            migrationBuilder.DropForeignKey(
                name: "FK_CuentaCorrientes_Cobros_CobroID",
                table: "CuentaCorrientes");

            migrationBuilder.DropForeignKey(
                name: "FK_CuentaCorrientes_Ventas_VentaID",
                table: "CuentaCorrientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Personas_PersonaID",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_PersonaID",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Cobros_PersonaID",
                table: "Cobros");

            migrationBuilder.AlterColumn<int>(
                name: "VentaID",
                table: "CuentaCorrientes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CobroID",
                table: "CuentaCorrientes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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
        }
    }
}
