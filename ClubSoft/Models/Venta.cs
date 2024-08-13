using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Venta

{
     [Key]
     public int VentaID { get; set; }

     public int PersonaID { get; set; }
     public int CuentaCorrienteID { get; set; }
     public DateTime Fecha { get; set; }
     public string? Estado { get; set; }
     public decimal? Total { get; set; }
     //relacionar con cta cte

     public virtual Persona Persona { get; set; }
      public virtual CuentaCorriente CuentaCorriente { get; set; }
     public virtual ICollection<DetalleVenta> DetalleVentas { get; set; }

      public class VistaVentas
{
     public int VentaID { get; set; }
     public int PersonaID { get;set;}
     public DateTime Fecha { get; set; }
     public string? Estado { get; set; }
     public decimal? Total { get; set; }

     public string? NombrePersona { get; set; }
     public string? ApellidoPersona { get; set; }

     }

}