using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Venta

{
     [Key]
     public int VentaID { get; set; }
     public DateTime Fecha { get; set; }
     public int PersonaID { get; set; }
     public Estado Estado { get; set; }
     public decimal? Total { get; set; }
     public string? UsuarioID { get; set; }


     public virtual Persona Persona { get; set; }

     public virtual ICollection<DetalleVenta> DetalleVentas { get; set; }

}

public enum Estado
{
     Temporal = 0,
     Confirmado,
     Anulado,
     Pagado,
     Eliminado,
}



public class VistaVentas
{
     public int VentaID { get; set; }
     public string Fecha { get; set; }
     public string? Estado { get; set; }
     public decimal? Total { get; set; }
     public string? NombrePersona { get; set; }
     public string? ApellidoPersona { get; set; }

}

public class VentaProductoDTO
{
    public int ProductoID { get; set; }
    public string? Nombre { get; set; }
    public decimal Precio { get; set; }
    public int Cantidad { get; set; }
}
