using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Cobro

{
     [Key]
     public int CobroID { get; set; }
     public DateTime Fecha { get; set; }
     public int PersonaID { get; set; } //CLIENTE
     public EstadoCobro EstadoCobro { get; set; }
     public decimal? Total { get; set; }
     public string? UsuarioID { get; set; } //quien registra el cobro


}
public enum EstadoCobro
{
     Temporal = 1,
     Confirmado,
     Anulado
}
