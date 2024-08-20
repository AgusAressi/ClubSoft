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
    
    //EL MOVIMIENTO DE CUENTA CORRIENTE PUEDE VENIR DE: COBRO, FACTURA,
    public virtual Persona Persona { get; set; }
   
    
    public class VistaCuentaCorrientes {
     public int CuentaCorrienteID { get; set; }
    public int PersonaID { get; set; }
    public decimal Saldo { get; set; }
    public decimal Ingreso { get; set; }
    public decimal Egreso { get; set; }
    public string? Descripcion { get; set; }
    public DateTime Fecha { get; set; }
    public string? NombrePersona { get; set; }
    public string? ApellidoPersona { get; set; } 

    }

     
}