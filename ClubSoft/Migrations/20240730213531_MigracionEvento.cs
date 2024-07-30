using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClubSoft.Migrations
{
    /// <inheritdoc />
    public partial class MigracionEvento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Eventos",
                columns: table => new
                {
                    EventoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaEvento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Lugar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TipoEvento = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eventos", x => x.EventoID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Eventos");
        }
    }
}
