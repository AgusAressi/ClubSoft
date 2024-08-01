﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class MigracionTipoEventos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TipoEvento",
                table: "Eventos",
                newName: "Descripcion");

            migrationBuilder.AddColumn<int>(
                name: "TipoEventoID",
                table: "Eventos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TipoEventos",
                columns: table => new
                {
                    TipoEventoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoEventos", x => x.TipoEventoID);
                });

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

            migrationBuilder.DropTable(
                name: "TipoEventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_TipoEventoID",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "TipoEventoID",
                table: "Eventos");

            migrationBuilder.RenameColumn(
                name: "Descripcion",
                table: "Eventos",
                newName: "TipoEvento");
        }
    }
}
