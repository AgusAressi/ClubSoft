using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Cobro

{
     [Key]
     public int CobroID { get; set; }
     public DateTime Fecha { get; set; }
     public int PersonaID { get; set; } 
     public EstadoCobro EstadoCobro { get; set; }
     public decimal? Total { get; set; }
     public string? UsuarioID { get; set; } //quien registra el cobro
      public virtual Persona Persona { get; set; }


}
public enum EstadoCobro
{
     Temporal = 0,
     Confirmado,
     Anulado
}
