using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Cobro

{
    [Key]
    public int CobroID { get; set; }
    public int PedidoID { get; set; }
   
    public DateTime Fecha { get; set; }
    public decimal Importe { get; set; }

    public virtual ICollection<CuentaCorriente> CuentaCorrientes { get; set; }
    
}
