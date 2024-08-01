using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class CrearTipoEventos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_TipoEventos_TipoEventoID1",
                table: "Eventos");

            migrationBuilder.DropForeignKey(
                name: "FK_TipoEventos_TipoEventos_TipoEventoID1",
                table: "TipoEventos");

            migrationBuilder.DropIndex(
                name: "IX_TipoEventos_TipoEventoID1",
                table: "TipoEventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_TipoEventoID1",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "TipoEventoID1",
                table: "TipoEventos");

            migrationBuilder.DropColumn(
                name: "TipoEventoID1",
                table: "Eventos");

            migrationBuilder.AlterColumn<int>(
                name: "TipoEventoID",
                table: "Eventos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_TipoEventoID",
                table: "Eventos",
                column: "TipoEventoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_TipoEventos_TipoEventoID",
                table: "Eventos",
                column: "TipoEventoID",
                principalTable: "TipoEventos",
                principalColumn: "TipoEventoID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_TipoEventos_TipoEventoID",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_TipoEventoID",
                table: "Eventos");

            migrationBuilder.AddColumn<int>(
                name: "TipoEventoID1",
                table: "TipoEventos",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TipoEventoID",
                table: "Eventos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "TipoEventoID1",
                table: "Eventos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TipoEventos_TipoEventoID1",
                table: "TipoEventos",
                column: "TipoEventoID1");

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_TipoEventoID1",
                table: "Eventos",
                column: "TipoEventoID1");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_TipoEventos_TipoEventoID1",
                table: "Eventos",
                column: "TipoEventoID1",
                principalTable: "TipoEventos",
                principalColumn: "TipoEventoID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TipoEventos_TipoEventos_TipoEventoID1",
                table: "TipoEventos",
                column: "TipoEventoID1",
                principalTable: "TipoEventos",
                principalColumn: "TipoEventoID");
        }
    }
}
