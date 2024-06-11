using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Factura

{
    [Key]
    public int FacturaID { get; set; }
    public int PersonaID { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Importe { get; set; }

    public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
    public virtual ICollection<CuentaCorriente> CuentaCorrientes { get; set; }

}