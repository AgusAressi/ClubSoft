using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Producto
{
     [Key]
    public int ProductoID { get; set; }
    public string? Nombre { get; set; }
    public decimal Precio { get; set; }
    public decimal Cantidad { get; set; }
    public string? Descripcion { get; set; }
    public bool? Estado { get; set;} = true;
    public int TipoProductoID { get; set; }
    public virtual TipoProducto TipoProducto { get; set; }

     public virtual ICollection<DetalleVenta> DetalleVentas { get; set; }

    public class VistaTipoProductos
{
    public int ProductoID { get; set; }
    public int TipoProductoID { get; set; }
    public string? Nombre { get; set; }
   public decimal Precio { get; set; }
    public decimal Cantidad { get; set; }
    public string? Descripcion { get; set; }
    public bool? Estado { get; set;}
    public string? NombreTipoProducto { get; set; }

}
}

