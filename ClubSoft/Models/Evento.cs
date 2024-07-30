using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Evento
{
     [Key]
    public int EventoID { get; set; }
    public DateTime FechaEvento  { get; set; }
    public string? Lugar { get; set; }
    public string? TipoEvento { get; set; }

}