using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class DetalleFactura

{
    [Key]
    public int DetalleFacturaID { get; set; }
    
    public string? Detalle { get; set; }
    
    
}