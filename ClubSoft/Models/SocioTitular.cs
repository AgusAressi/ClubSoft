using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class SocioTitular

{
    [Key]
    public int SocioTitularID { get; set; }
    public int PersonaID { get; set; }

    public virtual ICollection<SocioAdherente> SocioAdherentes { get; set; }
    public virtual Persona Persona { get; set; }

}
public class VistaSociosTitulares
{
    public int SocioTitularID { get; set; }
    public int PersonaID { get; set; }
    public string? PersonaNombre { get; set; }
    public string? PersonaApellido { get; set; }

}

