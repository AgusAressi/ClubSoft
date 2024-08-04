using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class TipoProducto
{
     [Key]
    public int TipoProductoID { get; set; }
    public string? Nombre { get; set; }
    
    // public virtual ICollection<Producto> Productos { get; set; }
}