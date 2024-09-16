using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class ModificacionTablaSocios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocioTitulares_SocioAdherentes_SocioAdherenteID",
                table: "SocioTitulares");

            migrationBuilder.DropIndex(
                name: "IX_SocioTitulares_SocioAdherenteID",
                table: "SocioTitulares");

            migrationBuilder.DropColumn(
                name: "SocioAdherenteID",
                table: "SocioTitulares");

            migrationBuilder.CreateIndex(
                name: "IX_SocioAdherentes_SocioTitularID",
                table: "SocioAdherentes",
                column: "SocioTitularID");

            migrationBuilder.AddForeignKey(
                name: "FK_SocioAdherentes_SocioTitulares_SocioTitularID",
                table: "SocioAdherentes",
                column: "SocioTitularID",
                principalTable: "SocioTitulares",
                principalColumn: "SocioTitularID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocioAdherentes_SocioTitulares_SocioTitularID",
                table: "SocioAdherentes");

            migrationBuilder.DropIndex(
                name: "IX_SocioAdherentes_SocioTitularID",
                table: "SocioAdherentes");

            migrationBuilder.AddColumn<int>(
                name: "SocioAdherenteID",
                table: "SocioTitulares",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SocioTitulares_SocioAdherenteID",
                table: "SocioTitulares",
                column: "SocioAdherenteID");

            migrationBuilder.AddForeignKey(
                name: "FK_SocioTitulares_SocioAdherentes_SocioAdherenteID",
                table: "SocioTitulares",
                column: "SocioAdherenteID",
                principalTable: "SocioAdherentes",
                principalColumn: "SocioAdherenteID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
