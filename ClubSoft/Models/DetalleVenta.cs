using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class DetalleVenta


{
    [Key]
    public int DetalleVentaID { get; set; }
    public int VentaID { get; set; }
    public int ProductoID { get; set; }
    public string? UsuarioID { get; set; }
    public decimal Cantidad { get; set; }
    public decimal Precio { get; set; }
    public decimal SubTotal { get; set; }

    public virtual Venta Venta { get; set; }
    public virtual Producto Producto { get; set; }

}