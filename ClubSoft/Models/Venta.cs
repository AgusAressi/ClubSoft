using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Venta

{
     [Key]
     public int VentaID { get; set; }
     public DateTime Fecha { get; set; }
     public int PersonaID { get; set; } //CLIENTE
     public Estado Estado { get; set; }
     public decimal? Total { get; set; }
     public string? UsuarioID { get; set; } //quien registra la venta


     public virtual ICollection<DetalleVenta> DetalleVentas { get; set; }

}

public enum Estado
{
     Temporal = 1,
     Confirmado,
     Anulado
}



public class VistaVentas
{
     public int VentaID { get; set; }
     public DateTime Fecha { get; set; }
     public string? Estado { get; set; }
     public decimal? Total { get; set; }
     public string? NombrePersona { get; set; }
     public string? ApellidoPersona { get; set; }

}