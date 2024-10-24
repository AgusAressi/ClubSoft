using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Persona

{
    [Key]
    public int PersonaID { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public string? DNI { get; set; }
    public int LocalidadID { get; set; }
    public string? UsuarioID { get; set; }

    public virtual Localidad Localidad { get; set; }

    public virtual ICollection<Venta> Ventas { get; set; }

    public virtual ICollection<CuentaCorriente> CuentaCorrientes { get; set; }

}
public class VistaPersonas
{
    public int PersonaID { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public string? DNI { get; set; }
    public int LocalidadID { get; set; }
    public string? NombreLocalidad { get; set; }
    public string? NombreProvincia { get; set; }
    public string? UsuarioID { get; set; }
    public string? Email { get; set; }
    public string? RolNombre { get; set; }

}

public class VistaUsuarios
{
    public string? UsuarioID { get; set; }
    public string? Email { get; set; }
    public string? RolNombre { get; set; }
}

