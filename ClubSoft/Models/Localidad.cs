using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Localidad

{
    [Key]
    public int LocalidadID { get; set; }
    public string? Nombre { get; set; }
    public int ProvinciaID { get; set; }

    public virtual Provincia Provincia { get; set; }
    public virtual ICollection<Persona> Personas { get; set; }

}
public class Vistalocalidades
{
    public int LocalidadID { get; set; }
    public int ProvinciaID { get; set; }
    public string? Nombre { get; set; }
    public string? NombreProvincia { get; set; }
    
}

