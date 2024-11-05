using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class CuentaCorriente

{
    [Key]
    public int CuentaCorrienteID { get; set; }
    public int PersonaID { get; set; }
    public decimal Saldo { get; set; }
    public decimal Ingreso { get; set; }
    public decimal Egreso { get; set; }
    public string? Descripcion { get; set; }
    public DateTime Fecha { get; set; }
    public int VentaID { get; set; }
    public int CobroID { get; set; }


    public virtual Persona Persona { get; set; }
    public virtual Venta Venta { get; set; }
    public virtual Cobro Cobro { get; set; }

}

public class VistaCuentaCorrientes
{
    public int CuentaCorrienteID { get; set; }
    public int PersonaID { get; set; }
    public decimal Saldo { get; set; }
    public decimal Ingreso { get; set; }
    public decimal Egreso { get; set; }
    public string? Descripcion { get; set; }
    public string Fecha { get; set; }
    public string? NombrePersona { get; set; }
    public string? ApellidoPersona { get; set; }

}